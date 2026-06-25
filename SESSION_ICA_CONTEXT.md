# SESSION_ICA_CONTEXT.md — ICA Platform
Derniere mise a jour : 25 juin 2026

---

## STACK TECHNIQUE
- n8n Cloud Pro 2.25.7 : immo-conseil-antilles.app.n8n.cloud
- Supabase : xdrlgyqxdbdvzrneujgz — Vercel : ica-platform.vercel.app
- GitHub : AIC-971/ica-platform — Meta WhatsApp Cloud API
- Phone Number ID : 1241064202413162 — WABA : 1340658904686436
- Vapi Assistant : d3997dfd-6122-477f-9f20-fbabfeaedf22
- Cle API n8n active : Claude-Session-10 (never expires, ends K9Tg)

---

## MODULES OPERATIONNELS

**Lea WhatsApp** srE5JWjDsf0yDWN7 — PUBLIE
- Architecture : Webhook WA Messages (POST, onReceived) > Parser WA > Agreger Contexte (Code node, runOnceForAllItems) > Generer Reponse Lea > Extraire Reponse > Envoyer Message WA > Log Supabase WA
- Agreger Contexte : interroge Supabase via cle anon — historique cross-canal + identification proprietaire
- Log Supabase WA : expressions corrigees 24/06
- Prompt multi-metiers : syndic, vente, achat, location, gestion
- PATTERN CRITIQUE n8n 2.25.7 : runOnceForAllItems = return [{json:{}}] OK / runOnceForEachItem = ERREUR json-is-not-object
- this.getCredentials() NON dispo Code nodes — utiliser cle anon directement
- Cle anon : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzA5NTMsImV4cCI6MjA1OTYwNjk1M30.lOzF44GIm6sH8PyIMdRAYtZB4HgTzTNqLgTzFVzYuRw
- get_historique_contact : GRANT TO service_role + anon (24/06)

**SYNC Estale** 9JmHqRKkjDx88qqw — PUBLIE cron 2h — tourne depuis 19/06

**Dream Worker** EB1xXO82jojuUxMv — PUBLIE cron 3h — 16 entrees ia_memory

**Demarchage** NXvKhsUcjOl5zN8R — PUBLIE
- Fix 24/06 : email_destinataire -> dollar-sign(Prospects A Demarcher).first().json.email
- 20271 contacts — 2337 sans email (WA Twilio pending)
- FB Marketplace ANNULE — 11 prospects supprimes 24/06

**Dashboard** ica-platform.vercel.app — commit 88961df (25/06)
- 6 onglets deployes — auth 3 roles
- Module 8 commissions OK — Module 9 conformite RSAC/CCI OK
- Badge IA Mail : Vase clos (corrige 25/06)

**Vapi Lea** — Assistant configure, workflow x6XxHa9GXJfcw40p PUBLIE
- ElevenLabs non configure — numeros SFR non connectes

**Module 2B PDF** 6oJ6ST7mjyeZGeZn — NON ACTIVE (attend IA Mail)

---

## RESTE A FAIRE (liste complete, ordre de priorite)

**PRIORITE HAUTE**
1. Lea WA — Memoire session en cours : log chaque echange -> relecture au message suivant
2. Lea WA — Multi-contacts meme nom (2 Pasquier) : ajouter confirmation identite (lot, copropriete)

**MODULES INCOMPLETS**
3. IA Mail locatif@immoconseil-gpe.com : OUBLIE CDC — dupliquer workflow syndic@, adapter prompt
4. IA Mail 4 boites (syndic/juridique/technique/mf.berret) : UNPUBLISHED — prerequis : labels Gmail + 10 tests E2E + validation Jeremy
5. Module 2B PDF : s active en meme temps que IA Mail
6. Vapi voix francaise : Pauline enregistrement 1 min -> ElevenLabs -> Vapi
7. Numeros SFR -> Vapi : apres tests internes complets
8. WhatsApp Twilio P8 : compte + numero +590 — WA sortant gestionnaires (alertes niveau 1) + communications regulieres (cyclone/AG/taxes/loyers) vers 2337 contacts sans email

**LONG TERME**
9. Rapport Lea par copropriete pour AG (calls + emails + interventions)
10. Depot rapport PDF dans Drive Estale (API GraphQL write)
11. Module 5 locatif : import Hektor Excel -> Supabase demarrable maintenant / reste attend API Estale sep 2026

---

## ANNULE DEFINITIF (ne plus jamais mentionner ni coder)
- DVF + BODACC — scraping LBC/PAP/Amivac/Facebook — FB Marketplace
- Module 6 Recrutement agents (supprime definitivement le 25/06)

---

## SUPABASE
- RLS actif 47 tables — prospects nettoyee (FB Marketplace 24/06)
- get_historique_contact GRANT TO service_role + anon

---

## PROCHAINE SESSION : commencer par
1. Vapi : Pauline enregistrement + ElevenLabs + voix
2. Twilio : creer compte + numero +590
3. Lea WA memoire session en cours
4. IA Mail locatif@ (oublie CDC)
