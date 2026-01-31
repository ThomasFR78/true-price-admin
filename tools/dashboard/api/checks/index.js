const { supabase } = require('../_lib/supabase');

/**
 * API: Liste des price checks
 * GET /api/checks - Liste tous les checks
 * POST /api/checks - Ajoute un nouveau check
 */
module.exports = async (req, res) => {
    if (req.method === 'GET') {
        const { vendor, limit = 50 } = req.query;

        let query = supabase
            .from('price_checks')
            .select(`
                *,
                offers (id, name, store, region, displayed_price, url)
            `)
            .order('check_date', { ascending: false })
            .limit(parseInt(limit));

        const { data, error } = await query;

        if (error) return res.status(500).json({ error: error.message });

        // Filtrer par vendor si demandé
        let filtered = data;
        if (vendor) {
            filtered = data.filter(d => d.offers?.store?.toLowerCase() === vendor.toLowerCase());
        }

        // Ajouter les calculs d'écart
        const enriched = filtered.map(check => {
            const realPrice = check.price_card || check.price_paypal;
            const ggdealsPrice = check.price_ggdeals;

            return {
                ...check,
                calculated: {
                    real_price: realPrice,
                    gap_ggdeals: ggdealsPrice && realPrice
                        ? (ggdealsPrice - realPrice).toFixed(2)
                        : null,
                    gap_percent: ggdealsPrice && realPrice
                        ? (((ggdealsPrice - realPrice) / realPrice) * 100).toFixed(1)
                        : null,
                    is_accurate: ggdealsPrice && realPrice
                        ? Math.abs(ggdealsPrice - realPrice) < 0.50
                        : null
                }
            };
        });

        return res.json(enriched);
    }

    if (req.method === 'POST') {
        // Proxy vers l'API page-checker existante
        // Ou implémentation directe
        const {
            offer_id,
            price_paypal,
            price_card,
            price_ggdeals,
            notes
        } = req.body;

        if (!offer_id) {
            return res.status(400).json({ error: 'offer_id requis' });
        }

        const { data, error } = await supabase
            .from('price_checks')
            .insert({
                offer_id,
                price_paypal: price_paypal || null,
                price_card: price_card || null,
                price_ggdeals: price_ggdeals || null,
                notes: notes || ''
            })
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
};
