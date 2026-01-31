/**
 * Script de génération de données de démonstration
 * True Price Authority - Price Checks
 *
 * ⚠️ IMPORTANT: Ce script respecte les données existantes
 * - Ne supprime PAS les données existantes
 * - Ajoute des données démo UNIQUEMENT si la DB est vide
 * - Les screenshots sont stockés dans Supabase Storage
 *
 * Usage: node scripts/seed-price-checks.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Configuration
const STORAGE_BUCKET = 'screenshots'; // Bucket Supabase pour les screenshots

async function checkExistingData() {
    const { count: offersCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true });

    const { count: checksCount } = await supabase
        .from('price_checks')
        .select('*', { count: 'exact', head: true });

    return { offersCount: offersCount || 0, checksCount: checksCount || 0 };
}

async function listExistingScreenshots() {
    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list('', { limit: 100 });

    if (error) {
        console.log('   ℹ️ Bucket screenshots non accessible ou vide');
        return [];
    }

    return data || [];
}

async function showDatabaseStatus() {
    console.log('═══════════════════════════════════════');
    console.log('📊 ÉTAT DE LA BASE DE DONNÉES');
    console.log('═══════════════════════════════════════\n');

    // 1. Compter les données existantes
    const { offersCount, checksCount } = await checkExistingData();
    console.log(`📦 Offres existantes: ${offersCount}`);
    console.log(`🔍 Price checks existants: ${checksCount}`);

    // 2. Lister les screenshots
    const screenshots = await listExistingScreenshots();
    console.log(`📸 Screenshots dans le bucket: ${screenshots.length}`);

    if (screenshots.length > 0) {
        console.log('\n   Derniers screenshots:');
        screenshots.slice(0, 5).forEach(s => {
            console.log(`   - ${s.name} (${(s.metadata?.size / 1024).toFixed(1)} KB)`);
        });
    }

    // 3. Stats sur les checks récents
    if (checksCount > 0) {
        const { data: recentChecks } = await supabase
            .from('price_checks')
            .select(`
                id, check_date, price_card, price_ggdeals,
                screenshot_card, screenshot_ggdeals,
                offers (name, store)
            `)
            .order('check_date', { ascending: false })
            .limit(5);

        console.log('\n📋 Derniers price checks:');
        recentChecks?.forEach(c => {
            const gap = c.price_ggdeals && c.price_card
                ? (c.price_ggdeals - c.price_card).toFixed(2)
                : 'N/A';
            const hasScreenshot = c.screenshot_card || c.screenshot_ggdeals ? '📸' : '';
            console.log(`   - ${c.offers?.name || 'Unknown'} @ ${c.offers?.store || 'Unknown'}: ${gap}€ ${hasScreenshot}`);
        });
    }

    console.log('\n═══════════════════════════════════════\n');

    return { offersCount, checksCount, screenshots };
}

async function seedDemoData() {
    console.log('🚀 Ajout de données de démonstration...\n');

    // Jeux et vendeurs pour la démo
    const DEMO_GAMES = [
        { name: 'GTA VI Pre-order', basePrice: 69.99 },
        { name: 'EA Sports FC 26', basePrice: 59.99 },
        { name: 'Elden Ring DLC', basePrice: 39.99 }
    ];

    const DEMO_VENDORS = [
        { name: 'Eneba', accuracy: 0.85 },
        { name: 'G2A', accuracy: 0.70 }
    ];

    const offers = [];
    for (const game of DEMO_GAMES) {
        for (const vendor of DEMO_VENDORS) {
            offers.push({
                url: `https://${vendor.name.toLowerCase()}.com/demo/${game.name.toLowerCase().replace(/\s/g, '-')}`,
                name: `[DEMO] ${game.name}`,
                store: vendor.name,
                region: 'EU',
                displayed_price: (game.basePrice * 0.75).toFixed(2)
            });
        }
    }

    const { data: insertedOffers, error: offerError } = await supabase
        .from('offers')
        .insert(offers)
        .select();

    if (offerError) {
        console.error('Erreur:', offerError);
        return;
    }

    console.log(`   ✓ ${insertedOffers.length} offres démo créées`);

    // Créer quelques checks
    const checks = [];
    for (const offer of insertedOffers) {
        const vendor = DEMO_VENDORS.find(v => v.name === offer.store);

        for (let i = 0; i < 3; i++) {
            const daysAgo = i * 3;
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - daysAgo);

            const priceCard = parseFloat(offer.displayed_price);
            const ggdealsError = Math.random() > vendor.accuracy ? (Math.random() - 0.5) * 3 : 0;
            const priceGGDeals = parseFloat((priceCard + ggdealsError).toFixed(2));

            checks.push({
                offer_id: offer.id,
                check_date: checkDate.toISOString(),
                price_card: priceCard,
                price_paypal: parseFloat((priceCard * 1.02).toFixed(2)),
                price_ggdeals: priceGGDeals,
                notes: '[DEMO DATA]'
            });
        }
    }

    const { error: checkError } = await supabase.from('price_checks').insert(checks);

    if (checkError) {
        console.error('Erreur checks:', checkError);
        return;
    }

    console.log(`   ✓ ${checks.length} price checks démo créés\n`);
}

async function main() {
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   TRUE PRICE AUTHORITY - DATA TOOL    ║');
    console.log('╚═══════════════════════════════════════╝\n');

    const { offersCount, checksCount, screenshots } = await showDatabaseStatus();

    if (offersCount === 0 && checksCount === 0) {
        console.log('⚠️ Base de données vide - ajout de données démo...\n');
        await seedDemoData();
        console.log('✅ Données démo ajoutées!');
    } else {
        console.log('✅ Base de données contient des données réelles');
        console.log('   → Les données démo ne seront PAS ajoutées');
        console.log('   → Utilisez le dashboard pour voir les données existantes');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📌 RAPPELS IMPORTANTS');
    console.log('═══════════════════════════════════════');
    console.log('• Les screenshots doivent être uploadés dans le bucket "screenshots"');
    console.log('• Format recommandé: {offer_id}_{timestamp}_{type}.png');
    console.log('  Exemple: 42_1706520000_card.png');
    console.log('• Les URLs de screenshots sont stockées dans price_checks.screenshot_*');
    console.log('═══════════════════════════════════════\n');
}

main().catch(console.error);
