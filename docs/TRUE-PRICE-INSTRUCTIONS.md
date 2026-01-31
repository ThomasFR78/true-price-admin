# True Price Authority - Guide d'utilisation

## 🎯 Dashboards déployés

| Projet | URL | Description |
|--------|-----|-------------|
| True Price Authority | https://true-price-authority.vercel.app | Dashboard public de classement vendeurs |
| True Price Admin | https://true-price-admin.vercel.app | Interface admin (si déployé) |
| Competitive Intelligence | https://competitive-intelligence.vercel.app | Surveillance concurrentielle |

## 📊 Template CSV - Saisie manuelle des prix

### Fichier: `true-price-template.csv`

### Colonnes:
- **game_name**: Nom du jeu
- **merchant**: Vendeur (Eneba, G2A, Kinguin, CDKeys, Instant Gaming, etc.)
- **allkeyshop_price**: Prix affiché sur Allkeyshop
- **ggdeals_price**: Prix affiché sur GG.deals
- **actual_price**: Prix RÉEL au checkout (avec frais)
- **currency**: Devise (EUR, USD, GBP)
- **check_date**: Date de vérification (YYYY-MM-DD)
- **notes**: Observations (frais cachés, etc.)

### Workflow de vérification:
1. Choisir un jeu populaire
2. Noter le prix sur Allkeyshop et GG.deals
3. Aller jusqu'au checkout sur chaque marchand
4. Noter le prix FINAL (avec tous les frais)
5. Calculer l'écart = actual_price - allkeyshop_price

### Calcul du Lie Rate:
```
Lie Rate = ((actual_price - advertised_price) / advertised_price) * 100
```

### Calcul du Score de Fiabilité:
```
Fiabilité = 100 - average_lie_rate
```

## 🏆 Badges de classement

| Score | Badge | Couleur |
|-------|-------|---------|
| 95-100% | MOST HONEST | Vert |
| 85-94% | FIABLE | Bleu |
| 75-84% | CORRECT | Jaune |
| 60-74% | MOYEN | Orange |
| 40-59% | ATTENTION | Rouge clair |
| 0-39% | SCAM ALERT | Rouge |

## 🔧 Configuration Supabase

Les variables d'environnement requises:
- `SUPABASE_URL`: URL du projet Supabase
- `SUPABASE_SERVICE_KEY`: Clé service (pour les API)

## 📁 Structure des repos GitHub

### ThomasFR78/true-price-admin
```
├── api/
│   ├── _lib/supabase.js
│   ├── checks/
│   │   └── [id].js
│   ├── offers.js
│   └── stats.js
├── public/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── package.json
└── vercel.json
```

### ThomasFR78/competitive-intelligence
```
├── api/
│   ├── _lib/supabase.js
│   └── dashboard/feed.js
├── public/
│   └── index.html
├── package.json
└── vercel.json
```

## 🚀 Prochaines étapes

1. [ ] Importer le CSV dans Supabase
2. [ ] Configurer la clé service Supabase dans Vercel
3. [ ] Tester l'API avec des vraies données
4. [ ] Automatiser le scraping (Phase 2)
