# Déploiement Vercel — Plateforme ICA

## Structure du projet
```
ica-platform/
├── api/
│   └── chat.js          ← Proxy Claude API (serverless)
├── public/
│   ├── index.html       ← Dashboard principal (= dashboard_ica.html)
│   ├── module8_commissions.html
│   ├── module9_conformite.html
│   └── cloture_intervention.html
└── vercel.json
```

## Déploiement (15 minutes)

### Étape 1 — Compte Vercel
1. Aller sur https://vercel.com
2. "Sign up" → continuer avec GitHub (créer un compte GitHub si besoin)

### Étape 2 — Préparer les fichiers
1. Sur votre Mac, créer un dossier `ica-platform`
2. Déposer dedans exactement cette structure :
   - Le dossier `api/` avec `chat.js`
   - Le dossier `public/` avec tous les HTML
   - Le fichier `vercel.json`
3. **Remplacer les placeholders** par vos vrais fichiers :
   - `module8_commissions.html` → votre fichier local
   - `module9_conformite.html` → votre fichier local
   - `cloture_intervention.html` → votre fichier local

### Étape 3 — Déployer
**Option A — Via l'interface web (le plus simple) :**
1. Aller sur https://vercel.com/new
2. Cliquer "Browse" et sélectionner votre dossier `ica-platform`
3. Cliquer "Deploy"

**Option B — Via CLI :**
```bash
npm install -g vercel
cd ica-platform
vercel
```

### Étape 4 — Ajouter la clé API Anthropic (OBLIGATOIRE)
1. Dans Vercel Dashboard → votre projet → "Settings"
2. Aller dans "Environment Variables"
3. Ajouter :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : votre clé depuis https://console.anthropic.com
   - **Environment** : Production + Preview + Development
4. Cliquer "Save"
5. Aller dans "Deployments" → cliquer "Redeploy" sur le dernier déploiement

### Étape 5 — Accès iPhone
- Votre URL sera : `https://ica-platform.vercel.app` (ou similaire)
- Ouvrir Safari sur iPhone → entrer l'URL
- "Partager" → "Sur l'écran d'accueil" → icône sur l'iPhone

## Variables d'environnement requises
| Variable | Valeur | Où trouver |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | https://console.anthropic.com/settings/keys |

## Notes
- Supabase est appelé directement depuis le navigateur (clé service_role dans le HTML)
- Claude API est appelé via le proxy `/api/chat` (clé cachée côté serveur)
- Déploiements automatiques si vous connectez GitHub
- Domaine personnalisé possible dans Settings → Domains
