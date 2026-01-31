const { supabase } = require('../_lib/supabase');

/**
 * API: Résumé de l'audit des prix
 * GET /api/audit/summary
 *
 * Retourne les métriques clés de l'audit True Price Authority:
 * - Écarts moyens GG.deals vs prix réels
 * - Score de fiabilité par vendor
 * - Tendances récentes
 */
module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Récupérer tous les price checks
        const { data: checks, error } = await supabase
            .from('price_checks')
            .select(`
                *,
                offers (
                    id, name, store, region, displayed_price
                )
            `)
            .order('check_date', { ascending: false })
            .limit(500);

        if (error) throw error;

        // 2. Calculer les métriques
        const metrics = {
            total_checks: checks.length,
            checks_with_gap: 0,
            avg_gap_ggdeals: 0,
            avg_gap_percent: 0,
            vendors_audited: new Set(),
            accuracy_score: 0
        };

        let totalGap = 0;
        let totalGapPercent = 0;
        let checksWithGap = 0;

        checks.forEach(check => {
            const realPrice = check.price_card || check.price_paypal;
            const ggdealsPrice = check.price_ggdeals;

            if (check.offers?.store) {
                metrics.vendors_audited.add(check.offers.store);
            }

            if (realPrice && ggdealsPrice) {
                const gap = Math.abs(ggdealsPrice - realPrice);
                const gapPercent = (gap / realPrice) * 100;

                if (gap > 0.01) {
                    checksWithGap++;
                    totalGap += gap;
                    totalGapPercent += gapPercent;
                }
            }
        });

        metrics.checks_with_gap = checksWithGap;
        metrics.vendors_audited = metrics.vendors_audited.size;

        if (checksWithGap > 0) {
            metrics.avg_gap_ggdeals = (totalGap / checksWithGap).toFixed(2);
            metrics.avg_gap_percent = (totalGapPercent / checksWithGap).toFixed(1);
        }

        // Score de précision (100% = parfait, 0% = tout faux)
        metrics.accuracy_score = checks.length > 0
            ? (100 - (checksWithGap / checks.length * 100)).toFixed(1)
            : 100;

        // 3. Calculer les écarts par vendor
        const gapByVendor = {};
        checks.forEach(check => {
            const vendor = check.offers?.store || 'Unknown';
            const realPrice = check.price_card || check.price_paypal;
            const ggdealsPrice = check.price_ggdeals;

            if (!gapByVendor[vendor]) {
                gapByVendor[vendor] = { total_gap: 0, count: 0, checks: 0 };
            }

            gapByVendor[vendor].checks++;

            if (realPrice && ggdealsPrice) {
                const gap = ggdealsPrice - realPrice;
                gapByVendor[vendor].total_gap += gap;
                gapByVendor[vendor].count++;
            }
        });

        // Calculer les moyennes et scores par vendor
        const vendorScores = Object.entries(gapByVendor).map(([vendor, data]) => ({
            vendor,
            checks: data.checks,
            avg_gap: data.count > 0 ? (data.total_gap / data.count).toFixed(2) : 0,
            reliability: data.count > 0
                ? Math.max(0, 100 - Math.abs(data.total_gap / data.count) * 10).toFixed(0)
                : 'N/A'
        })).sort((a, b) => b.checks - a.checks);

        // 4. Derniers checks
        const recentChecks = checks.slice(0, 10).map(check => ({
            id: check.id,
            product: check.offers?.name || 'Unknown',
            vendor: check.offers?.store || 'Unknown',
            date: check.check_date,
            price_real: check.price_card || check.price_paypal,
            price_ggdeals: check.price_ggdeals,
            gap: check.price_ggdeals && (check.price_card || check.price_paypal)
                ? (check.price_ggdeals - (check.price_card || check.price_paypal)).toFixed(2)
                : null
        }));

        return res.json({
            generated_at: new Date().toISOString(),
            metrics,
            vendor_scores: vendorScores,
            recent_checks: recentChecks
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Erreur lors du calcul',
            details: error.message
        });
    }
};
