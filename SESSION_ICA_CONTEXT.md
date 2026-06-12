# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 12/06/2026*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : P7 Vapi — enregistrement Pauline (1 min) — clone ElevenLabs — numéro Vapi — tests mobile**

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

## WORKFLOWS N8N — ÉTAT AU 12/06/2026

- 9JmHqRKkjDx88qqw — SYNC Estale owners nightly — PUBLIÉ
  - Filtrer GL + Split par condo : CORRIGÉ 12/06 — exclut désormais 001GL (GL Propriétaires)
  - 63 copros syndic traitées (vs 64 avant avec GL inclus)
  - Formatter : PATCHe lots orphelins + UPSERTs proprietaires sans email
  - Upsert coproprietes manquantes dans Supabase via on_conflict=estale_id
- k5vfKezkdSJEBrEe — SYNC date_fin_mandat — PUBLIÉ
- rSe1NpkFmBepbdxz — Alertes fin de mandat — PUBLIÉ
- NXvKhsUcjOl5zN8R — Démarchage Pipeline — PUBLIÉ — Parser robuste 3 fallback OK
- x6XxHa9GXJfcw40p — Léa Vapi Webhooks — PUBLIÉ
- EB1xXO82jojuUxMv — Dream Worker ia_memory — PUBLIÉ
- 9WLzlCKNGEn5B97B — IA Mail syndic@ — UNPUBLISHED — E2E validé
- MMUAHW8vgEPd4UKo — IA Mail service.juridique@ — UNPUBLISHED
- SaxB3VWFwbZvCHHY — IA Mail service.technique@ — UNPUBLISHED
- kc6si9C7UTTnBYO9 — IA Mail mf.berret@ — UNPUBLISHED
- dPSvQdYPfM60bfEd — ONE-SHOT Lier lots copros — NON PUBLIÉ — timeout 60s en UI, marche en prod

---

## ÉTAT DONNÉES SUPABASE — 12/06/2026

### lots (table)
- Total : 1 683 lots, tous avec estale_id (tous viennent d'Estale)
- Liés copropriete_id : 1 171 (69.6%)
- Non liés : 512 — répartis en :
  - ~302 lots de la copropriété "001GL — GL Propriétaires" (gestion locative) → JAMAIS traités, on ne touche pas à la GL
  - ~210 lots de 4 copros syndic manquantes dans Supabase → seront liés au prochain sync nightly (2h du matin)
- IMPORTANT : les lots GL resteront orphelins indéfiniment — c'est intentionnel

### coproprietes : 60 lignes Supabase vs 63 syndics dans Estale — 3-4 copros syndic à créer via upsert au prochain sync

### proprietaires : 1 148 lignes (propriétaires avec lien copropriete_id)

### contacts_demarchage : 19 386 contacts

---

## LOTS — LOGIQUE COMPLÈTE

Les 1 683 lots = uniquement lots de SYNDIC (copropriété). Pas de lots GL ici.
La GL (001GL dans Estale) est exclue du SYNC owners depuis le 12/06/2026.
Vapi peut identifier tout propriétaire de syndic par nom/tél — les 302 "GL Propriétaires" ne sont pas des copropriétaires de syndic, ce sont des bailleurs.

---

## IA MAIL syndic@ — TEST E2E VALIDÉ 11/06/2026

Chaîne complète fonctionnelle (unpublished) — fixes appliqués :
- connexion Code Préparer -> Contexte Estale rétablie via API PUT
- Always Output Data sur Chercher Copropriétaire + Historique Mails
- Claude output : REPONDRE / ag / basse / réponse pro OK
- Pour publier : attendre validation Jeremy sur vrais emails

---

## PARSER MESSAGE DÉMARCHAGE — CORRIGÉ 11/06/2026

Fix : parser robuste 3 niveaux fallback (JSON.parse -> regex bloc JSON -> extraction champ par champ)
Testé 50 prospects — aucune erreur OK

---

## ROADMAP

- P1-P4 : COMPLÉTÉS
- P5 Module 2B PDF : déployé non activé
- P7 Vapi Léa : webhooks OK — EN COURS — attente enregistrement Pauline 1min
- P8 WhatsApp Twilio : à faire — 2337 contacts sans email
- P9 DVF+BODACC : ANNULÉ DÉFINITIVEMENT

---

## PATTERNS CRITIQUES

- n8n Code : this.helpers.httpRequest() UNIQUEMENT
- Merge node bloqué si 0 items -> Always Output Data
- API PUT n8n settings : timezone/saveManualExecutions/callerPolicy/errorWorkflow/executionOrder seulement
- Parser JSON Claude : toujours 3 niveaux fallback
- Formatter SYNC owners : timeout 60s en test UI — marche en production (cron)
- Session n8n expire 15-30min — recovery : naviguer signin, cliquer Sign In

---

## VAPI / LÉA

- Assistant Léa ID : d3997dfd-6122-477f-9f20-fbabfeaedf22
- Webhook : https://immo-conseil-antilles.app.n8n.cloud/webhook/vapi-events
- Tools : chercher_info (3555c59c), creer_dossier_intervention (80aebb2b), transfert_humain (7dd40782)
- Voix : Bella Multilingual v2 ElevenLabs (temporaire)
- Prochaine étape : enregistrement Pauline 1min -> clone ElevenLabs -> numéro Vapi -> tests mobile -> renvoi SFR
- NE PAS brancher SFR avant tests internes validés

---

## RÈGLES ABSOLUES

- agence@immoconseil-gpe.com = humain UNIQUEMENT, jamais automatique
- P9 DVF+BODACC ANNULÉ DÉFINITIVEMENT — Scraping LBC/PAP ARRÊTÉ
- IA Mail 4 boîtes : NE PAS PUBLIER sans approbation Jeremy
- GL (gestion locative) : on n'y touche pas pour l'instant
—é
