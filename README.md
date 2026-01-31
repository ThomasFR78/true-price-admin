# ✓ True Price Authority

> La source de vérité sur les prix — Audit, Transparence, Confiance

## 📋 Vue d'ensemble

True Price Authority est un projet **standalone** qui audite la vérité des prix affichés sur les comparateurs de clés de jeux (GG.deals, AllKeyShop) et les vendeurs (Eneba, G2A, Kinguin, etc.).

### Mission
**Auditer la Vérité Terrain pour devenir la "Source de Vérité" (Trust Authority).**

### Deadline MVP
📅 **15 Février 2026**

---

## 🏗️ Structure du Projet

```
True Price Authority/
├── docs/                    # Documentation
│   ├── PLAN.md             # Cahier des charges complet
│   └── last meeting with boss.png
├── presentations/           # Présentations
│   └── True Price Authority (Final Blue Steam).pptx
├── assets/                  # Ressources visuelles
│   └── cashback.jpg        # Comparatif cashback
├── reports/                 # Rapports générés
└── tools/
    └── dashboard/          # Dashboard True Price Authority
```

---

## 🎯 Fonctionnalités Principales

### 1. 📊 Baromètre des Menteurs
Calcul du **"Taux de Mensonge"** global et par vendeur.
- Gauge visuelle 0-100%
- Top menteurs de la semaine
- Alertes automatiques

### 2. 🏆 Leaderboard & Trophées
Classement des vendeurs par fiabilité :
- 🥇 **MOST HONEST** — Le vendeur le plus fiable
- 🥈🥉 Podium des meilleurs
- 🚨 **SCAM ALERT** — Vendeur à éviter

### 3. 🕵️ Audit d'Intégrité Vendeurs
Détection des pratiques douteuses :
- **Fake Promos** : Prix barrés gonflés artificiellement
- **Frais Cachés** : Protection acheteur forcée, frais de paiement
- Score d'honnêteté par vendeur

### 4. 🎟️ Crash-Test Coupons
Test de validité des codes promo :
- Le code fonctionne-t-il vraiment ?
- Quelle est la valeur réelle de la réduction ?

### 5. 💰 Cashback Comparator
Comparaison des offres de cashback (iGraal vs Direct).

---

## 🔧 Stack Technique

- **Frontend** : React + TailwindCSS (dashboard statique)
- **Backend** : Vercel Serverless Functions
- **Base de données** : Supabase (PostgreSQL)
- **Screenshots** : Supabase Storage

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Compte Supabase
- Vercel CLI

### Installation

```bash
# 1. Aller dans le dossier dashboard
cd tools/dashboard

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# 3. Créer les tables Supabase
# Exécuter scripts/schema.sql dans Supabase

# 4. Installer les dépendances
npm install

# 5. Vérifier les données existantes
node scripts/seed-price-checks.js

# 6. Lancer en local
npm run dev
```

### Accéder au Dashboard
Ouvrir `http://localhost:3000` dans le navigateur.

---

## 📊 APIs Disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/audit/summary` | GET | Résumé complet de l'audit |
| `/api/checks` | GET/POST | Liste et ajout de price checks |
| `/api/checks/:id` | GET | Détail d'un check |
| `/api/vendors` | GET | Score par vendeur |

### Exemple de réponse `/api/audit/summary`

```json
{
  "generated_at": "2026-01-30T...",
  "metrics": {
    "total_checks": 156,
    "lie_rate": "26.9",
    "avg_gap_ggdeals": "0.85",
    "vendors_audited": 6
  },
  "vendor_scores": [
    { "vendor": "Steam", "reliability": "100", "avg_gap": "0.00" },
    { "vendor": "CDKeys", "reliability": "95", "avg_gap": "0.15" }
  ],
  "recent_checks": [...]
}
```

---

## 📸 Screenshots & Preuves

Les screenshots sont **essentiels** pour la crédibilité de l'audit.

### Stockage
- Bucket Supabase : `screenshots`
- Format : `{offer_id}_{timestamp}_{type}.png`
- Types : `card`, `paypal`, `ggdeals`, `allkeyshop`

### Champs dans price_checks
- `screenshot_card` : Capture du checkout carte
- `screenshot_paypal` : Capture du checkout PayPal
- `screenshot_ggdeals` : Capture de GG.deals
- `screenshot_allkeyshop` : Capture de AllKeyShop

---

## 🔗 Flux de Données

```
┌─────────────────────────┐
│  COMPETITIVE INTEL      │
│  (Sitemap Monitor)      │
│  (Page Checker)         │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  SUPABASE               │
│  • offers               │
│  • price_checks         │
│  • screenshots (bucket) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  TRUE PRICE AUTHORITY   │
│  Dashboard              │
│  • Baromètre            │
│  • Leaderboard          │
│  • Audit vendeurs       │
└─────────────────────────┘
```

---

## 📈 Livrables Attendus (15 Mai)

1. **Dashboard Public** : Classement "Verified Trust" accessible publiquement
2. **Média Actif** : Infographies et vidéos publiées régulièrement
3. **API MCP** : Endpoint fonctionnel pour l'AI Oracle
4. **Rapport Cashback** : Étude de rentabilité

---

## 🎨 Media Factory

### Contenus à produire
- **Baromètre Hebdo** : Infographie pour Google Discover
- **Vidéos Shorts** : "On a testé 5 vendeurs, voici le résultat"
- **Reviews Data-Driven** : "Avis Eneba 2026 : Arnaque ou Bon plan ?"

---

## 🤖 AI Oracle (MCP)

Endpoint pour intégration IA :
```
GET /api/mcp/trust-score?vendor=Eneba
```

Retourne :
```json
{
  "vendor": "Eneba",
  "trust_score": 85,
  "best_price_verified": 45.99,
  "recommendation": "Fiable avec vigilance sur les promos"
}
```

---

## 📞 Contact

**Projet :** Standalone (Startup Studio)
**Lead :** Thomas Chartrain
**Philosophie :** Carte blanche — 100% Libre (No-Code, Python, etc.)
