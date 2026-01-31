-- ============================================
-- SCHEMA: True Price Authority
-- Base de données Supabase
-- ============================================

-- Table: Offres suivies
CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    url VARCHAR(2000) NOT NULL,
    name VARCHAR(500) NOT NULL,
    store VARCHAR(100) DEFAULT '',
    region VARCHAR(50) DEFAULT 'global',
    displayed_price DECIMAL(10,2),
    displayed_price_screenshot VARCHAR(500),
    payment_method VARCHAR(20) DEFAULT 'card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Price Checks (audits)
CREATE TABLE IF NOT EXISTS price_checks (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
    check_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reference_price DECIMAL(10,2),

    -- Prix réels au checkout
    price_paypal DECIMAL(10,2),
    price_card DECIMAL(10,2),

    -- Prix affichés sur GG.deals (par méthode de paiement)
    price_ggdeals_paypal DECIMAL(10,2),
    price_ggdeals_card DECIMAL(10,2),

    -- Prix affichés sur AKS (pour comparaison future)
    price_aks_paypal DECIMAL(10,2),
    price_aks_card DECIMAL(10,2),

    -- Prix affichés (legacy)
    price_ggdeals DECIMAL(10,2),
    price_allkeyshop DECIMAL(10,2),

    -- Coupons testés
    coupon_ggdeals VARCHAR(100),
    coupon_aks VARCHAR(100),

    -- Screenshots (preuve)
    screenshot_paypal VARCHAR(500),
    screenshot_card VARCHAR(500),
    screenshot_ggdeals VARCHAR(500),
    screenshot_allkeyshop VARCHAR(500),

    notes TEXT DEFAULT ''
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_offers_store ON offers(store);
CREATE INDEX IF NOT EXISTS idx_offers_created ON offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checks_offer ON price_checks(offer_id);
CREATE INDEX IF NOT EXISTS idx_checks_date ON price_checks(check_date DESC);

-- Vue: Résumé des écarts par vendeur
CREATE OR REPLACE VIEW vendor_accuracy AS
SELECT
    o.store as vendor,
    COUNT(pc.id) as total_checks,
    AVG(pc.price_ggdeals - COALESCE(pc.price_card, pc.price_paypal)) as avg_gap,
    AVG(ABS(pc.price_ggdeals - COALESCE(pc.price_card, pc.price_paypal))) as avg_abs_gap,
    COUNT(CASE WHEN ABS(pc.price_ggdeals - COALESCE(pc.price_card, pc.price_paypal)) < 0.50 THEN 1 END) as accurate_checks,
    ROUND(
        COUNT(CASE WHEN ABS(pc.price_ggdeals - COALESCE(pc.price_card, pc.price_paypal)) < 0.50 THEN 1 END)::numeric
        / NULLIF(COUNT(pc.id), 0) * 100, 1
    ) as accuracy_percent
FROM offers o
LEFT JOIN price_checks pc ON o.id = pc.offer_id
WHERE pc.price_ggdeals IS NOT NULL
  AND (pc.price_card IS NOT NULL OR pc.price_paypal IS NOT NULL)
GROUP BY o.store
ORDER BY total_checks DESC;
