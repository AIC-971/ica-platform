# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 11/06/2026*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : P7 Vapi — enregistrement Pauline (1 min) — clone ElevenLabs — brancher Vapi**

---

## STACK TECHNIQUE

- n8n Cloud Pro : immo-conseil-antilles.app.n8n.cloud — API key "Claude-Session-10" (Never expires, fin: BLtLR9K9Tg)
- Supabase : xdrlgyqxdbdvzrneujgz — RLS activé 13 tables
- Vercel : ica-platform.vercel.app
- GitHub : AIC-971/ica-platform — source: public/index_final.html
- Vapi : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- ElevenLabs : voix Bella Multilingual v2 (à remplacer par clone voix Pauline)
- Google Workspace : lea@immoconseil-gpe.com (envoi IA auto) — agence@immoconseil-gpe.com (humain UNIQUEMENT)

---

## WORKFLOWS N8N — ÉTAT AU 11/06/2026

- 9JmHqRKkjDx88qqw — SYNC Estale owners nightly — PUBLIÉ — Formatter stable (sans PATCH lots)
- k5vfKezkdSJEBrEe — SYNC date_fin_mandat — PUBLIÉ
- rSe1NpkFmBepbdxz — Alertes fin de mandat J-15/30/45/60 — PUBLIÉ
- NXvKhsUcjOl5zN8R — Démarchage Pipeline Supabase — PUBLIÉ — Parser robuste 3 fallback testé OK
- x6XxHa9GXJfcw40p — Léa Vapi Webhooks — PUBLIÉ
- EB1xXO82jojuUxMv — Dream Worker ia_memory — PUBLIÉ
- 9WLzlCKNGEn5B97B — IA Mail syndic@ — UNPUBLISHED — E2E validé 11/06
- MMUAHW8vgEPd4UKo — IA Mail service.juridique@ — UNPUBLISHED
- SaxB3VWFwbZvCHHY — IA Mail service.technique@ — UNPUBLISHED
- kc6si9C7UTTnBYO9 — IA Mail mf.berret@ — UNPUBLISHED

---

## ÉTAT DONNÉES SUPABASE — 11/06/2026

### lots
- Total : 1 683 (tous estale_id non-null, tous viennent d'Estale)
- Liés copropriete_id : 1 001
- Non liés : 682 — propriétaires hors périmètre GL, absents de proprietaires. Pas corrigeable en SQL.

### coproprietes : 60 lignes, 59 date_fin_mandat, 38+ dates AG

### logs_demarchage : 46+ rows, email/canal/sujet non-NULL sur derniers ✅

### contacts_demarchage : 19 386 contacts

---

## IA MAIL syndic@ — TEST E2E VALIDÉ 11/06/2026

Chaîne complète fonctionnelle (unpublished) :
Gmail Trigger — Code Préparer — Contexte Estale Syndic — Chercher Copropriétaire — Historique Mails — Fusionner Contexte — Switch — Préparer Prompt — Appel API Anthropic — Logger Supabase OK
Claude output : REPONDRE / ag / basse — réponse professionnelle OK
Seul Répondre Auto échoue (threadId fictif en test) — normal

Fixes 11/06 : connexion Code Préparer -> Contexte Estale rétablie via API PUT
Always Output Data sur Chercher Copropriétaire + Historique Mails

Pour publier : attendre validation Jeremy sur vrais emails

---

## PARSER MESSAGE DÉMARCHAGE — CORRIGÉ 11/06/2026

Fix : parser robuste 3 niveaux fallback (JSON.parse -> regex bloc JSON -> extraction champ par champ)
Testé 50 prospects — aucune erreur Unexpected token OK

---

## ROADMAP

- P1 Dream Worker : COMPLÉTÉ
- P2 Démarchage logs : COMPLÉTÉ
- P3 Alertes Estale : COMPLÉTÉ
- P4 IA Mail 4 boîtes E2E : VALIDÉ — publication en attente Jeremy
- P5 Module 2B PDF : déployé non activé
- P7 Vapi Léa : webhooks OK — EN COURS — attente enregistrement Pauline
- P8 WhatsApp Twilio : à faire — 2337 contacts sans email
- P9 DVF+BODACC : ANNULÉ DÉFINITIVEMENT

---

## PATTERNS CRITIQUES

- n8n Code : this.helpers.httpRequest() UNIQUEMENT
- Merge node bloqué si 0 items -> Always Output Data
- API PUT n8n settings : timezone/saveManualExecutions/callerPolicy/errorWorkflow/executionOrder seulement
- Parser JSON Claude : toujours 3 niveaux fallback
- Formatter SYNC owners : NE PAS ajouter PATCH lots (timeout 60s)
- Session n8n expire 15-30min — recovery : naviguer signin, cliquer Sign In

---

## VAPI / LÉA

- Assistant Léa ID : d3997dfd-6122-477f-9f20-fbabfeaedf22
- Webhook : https://immo-conseil-antilles.app.n8n.cloud/webhook/vapi-events
- Tools : chercher_info (3555c59c), creer_dossier_intervention (80aebb2b), transfert_humain (7dd40782)
- Voix actuelle : Bella Multilingual v2 ElevenLabs
- Prochaine étape : enregistrement Pauline 1min -> clone ElevenLabs -> numéro Vapi -> tests mobile -> renvoi SFR
- NE PAS brancher SFR avant tests internes validés

---

## RÈGLES ABSOLUES

- agence@immoconseil-gpe.com = humain UNIQUEMENT, jamais automatique
- P9 DVF+BODACC ANNULÉ DÉFINITIVEMENT / Scraping LBC/PAP ARRÊTÉ
- IA Mail 4 boîtes : NE PAS PUBLIER sans approbation Jeremy
