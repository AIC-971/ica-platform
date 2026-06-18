# SESSION ICA CONTEXT — Mis à jour le 18/06/2026

## STACK
n8n Cloud Pro · Supabase (xdrlgyqxdbdvzrneujgz) · Vercel (ica-platform.vercel.app) · GitHub (AIC-971/ica-platform) · Vapi · ElevenLabs · Meta WhatsApp Cloud API

## ROADMAP STATUS
- P1 Dreaming ✅ | P2 Démarchage ✅ | P3 Alertes Estale ⬜ | P4 IA Mail 4 boîtes ✅ (vase clos) | P5 Module 2B PDF ✅ (non activé) | P6 Dashboard ✅ | P7 Vapi 🟡 en cours | P8 WhatsApp 🟡 EN COURS (90%) | P9 DVF+BODACC ❌ ANNULÉ

---

## MODULE WHATSAPP — SESSION 18/06/2026

### CE QUI EST FAIT ✅
- App Meta "ICA Messagerie Pro" (ID: 1197733872504452) PUBLIÉE (Live)
- Utilisateur système "lea integration" (ID: 61590797229230) — token permanent généré (jamais expiration, stocké dans Bitwarden)
- Phone Number ID: 1241064202413162 | WABA ID: 1340658904686436 | PIN: 758249
- Webhook Meta vérifié → https://immo-conseil-antilles.app.n8n.cloud/webhook/whatsapp-wa
- Champ messages abonné côté Meta ✅
- Table Supabase conversations_whatsapp créée (RLS + service_role policy + index)
- Workflow n8n "Léa WhatsApp — Webhook Meta" (ID: srE5JWjDsf0yDWN7) Published
  - 11 nœuds : Webhook GET (vérif) + Webhook POST (messages) → Parser WA → Préparer Prompt → Générer Réponse Léa → Extraire Réponse → Envoyer Message WA → Log Supabase
  - Messages entrants confirmés (exécutions 16:07-16:29 le 18/06)

### BUG BLOQUANT ❌ — PRIORITÉ 1 PROCHAINE SESSION
**Nœud : "Générer Réponse Léa" (n7) — HTTP Request vers Anthropic**
- Erreur : "The value in the JSON Body field is not valid JSON"
- Cause : n8n Cloud rejette les expressions ={{ }} dans le body JSON du nœud HTTP Request
- Tentatives échouées : jsonBody string, specifyBody keypair, Code node (helpers.httpRequestWithAuthentication non disponible dans Code Node n8n)
- SOLUTION : Ouvrir le nœud dans l'UI → section Body → mode "Using Fields Below" (keypair) et renseigner model/max_tokens/system/messages individuellement avec les expressions n8n
- Auth OK : predefinedCredentialType + anthropicApi + "Anthropic account" (SsmgpFAZCENDy5q2)

### PENDING ANCIENS
- index_final.html : corriger badge Actif → Vase clos pour IA Mail
- Fix NULL fields dans Log Envoi Démarchage (workflow NXvKhsUcjOl5zN8R)
- n8n API key Claude-Fix-Temp expire 28/06/2026 → renouveler

---

## MODULES ACTIFS

### Dreaming / ia_memory ✅
Dream Worker (ID: EB1xXO82jojuUxMv) Published, cron 3h. 16 entries.

### SYNC Estale→Supabase ✅
ID: 9JmHqRKkjDx88qqw | Published | cron 2h | 63 copros syndic

### Workflow Démarchage ✅ (bug log NULL)
ID: NXvKhsUcjOl5zN8R | 20 271 contacts

### IA Mail 4 boîtes ✅ (UNPUBLISHED intentionnellement)
syndic@/juridique@/technique@/mf.berret@ — NE PAS PUBLIER avant prestataires+labels+10 tests

### Dashboard Vercel ✅
ica-platform.vercel.app/dashboard.html — 7 onglets

### Vapi / Léa voice 🟡
Assistant ID: d3997dfd-6122-477f-9f20-fbabfeaedf22 | ElevenLabs Bella Multilingual v2
Prochaines étapes : clone voix Pauline → tests → renvoi SFR

### WhatsApp 🟡 (90% — BUG CORPS REQUÊTE ANTHROPIC)
Voir section ci-dessus.

---

## ANNULÉS DÉFINITIVEMENT
Scraping LBC/PAP/Amivac / DVF+BODACC / Module locatif (jusqu'en sept 2026)
