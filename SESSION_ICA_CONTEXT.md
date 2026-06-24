# SESSION_ICA_CONTEXT.md — ICA Platform
Derniere mise a jour : 24 juin 2026

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
- Agreger Contexte : interroge Supabase via cle anon — historique cross-canal (get_historique_contact) + identification proprietaire dans table proprietaires
- Log Supabase WA : expressions corrigees 24/06 — dollar-sign('Agreger Contexte').all()[0].json
- Prompt multi-metiers : syndic, vente, achat, location, gestion — adaptatif selon identification contact
- PATTERN CRITIQUE n8n 2.25.7 : Code node runOnceForAllItems = return [{json:{}}] OK
- Code node runOnceForEachItem = return [{json:{}}] ERREUR json-is-not-object
- this.getCredentials() NON disponible dans Code nodes (credentials ignores via API PUT)
- this.helpers.httpRequest() disponible dans Code nodes (pas fetch())
- Cle anon Supabase utilisable directement dans Code nodes (cle publique)
- Cle anon : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzA5NTMsImV4cCI6MjA1OTYwNjk1M30.lOzF44GIm6sH8PyIMdRAYtZB4HgTzTNqLgTzFVzYuRw
- Hist. WA : noeud present mais deconnecte (remplace par logic interne Code node)
- get_historique_contact : GRANT TO service_role + anon (24/06)

**SYNC Estale** 9JmHqRKkjDx88qqw — PUBLIE cron 2h
- Tourne depuis 19/06 (auto-repare apres panne 12-18/06)
- 63 copros syndic, 1171/1683 lots lies, 512 orphelins

**Dream Worker** EB1xXO82jojuUxMv — PUBLIE cron 3h — 16 entrees ia_memory

**Module Demarchage** NXvKhsUcjOl5zN8R — PUBLIE
- Fix 24/06 : email_destinataire pointe sur dollar-sign('Prospects A Demarcher').first().json.email
- 20271 contacts totaux — 2337 sans email (WA Twilio pending)
- FB Marketplace ANNULE DEFINITIF — 11 prospects supprimes 24/06

**Dashboard ICA** ica-platform.vercel.app — commit 544b919
- 6 onglets deployes : Vue globale / Mails IA / Coproprietes / Demarchage / Vapi / Proprietaires
- Auth 3 roles (admin/gestionnaire/commercial)
- Module 8 commissions OK — Module 9 conformite RSAC/CCI OK
- MANQUANT : badge IA Mail Actif > Vase clos dans index_final.html (10 min)

**Vapi Lea** — Assistant d3997dfd configure, workflow x6XxHa9GXJfcw40p PUBLIE
- 3 outils : chercher_info, creer_dossier_intervention, transfert_humain
- ElevenLabs non configure — numeros SFR non connectes
- Ne pas connecter SFR avant tests internes complets

**Module 2B PDF** 6oJ6ST7mjyeZGeZn — NON ACTIVE (attend activation IA Mail)
- Vercel api/generate-rapport-pdf.js deploye — bucket Supabase Storage interventions cree

---

## NON ACTIVE / EN COURS

**IA Mail 4 boites** — TOUTES UNPUBLISHED intentionnel
- syndic@ 9WLzlCKNGEn5B97B — juridique@ MMUAHW8vgEPd4UKo
- technique@ SaxB3VWFwbZvCHHY — mf.berret@ kc6si9C7UTTnBYO9
- Prerequis avant activation : labels Gmail + 10 tests E2E + validation Jeremy sur textes
- IA Mail locatif@immoconseil-gpe.com : OUBLIE dans CDC — a creer (workflow a dupliquer)

**WhatsApp Twilio P8** — NON DEMARRE
- Compte Twilio a creer — numero +590 Guadeloupe
- WA sortant gestionnaires (alertes niveau 1 sinistres) non implemente
- Communications regulieres (cyclone/AG/taxes/revisions loyers) vers 2337 contacts sans email

---

## ANNULE DEFINITIF (ne plus jamais mentionner ni coder)
- DVF + BODACC prospecting
- Scraping LBC / PAP / Amivac / Facebook organique
- Facebook Marketplace scraping + demarchage (donnees supprimees 24/06)
- Demarchage agents commerciaux par scraping

---

## SUPABASE — POINTS CLES
- RLS actif sur 47 tables publiques (rowsecurity = true partout — verifie 24/06)
- Service role key : sb_secret_ckU4i... (n8n uniquement, jamais navigateur CORS bloque)
- get_historique_contact(TEXT) : GRANT TO service_role + anon (24/06)
- conversations_whatsapp : log Lea WA (from_number, message_recu, message_envoye, statut)
- ia_memory : 16 entrees — colonnes id/domaine/type_entree/cle/valeur/statut/priorite
- prospects : table Facebook Marketplace nettoyee (24/06)
- contacts_demarchage : 20271 lignes — UNIQUE idx sur (email, source)

---

## N8N — PATTERNS CRITIQUES (session 22-24 juin)
- API : PUT /api/v1/workflows/{id} avec X-N8N-API-KEY header
- settings : { executionOrder: v1 } — uniquement ces 5 cles max
- Webhook onReceived : repond 200 immediatement a Meta (evite retries)
- Cross-node refs dans runOnceForAllItems : dollar-sign('NodeName').all()[0].json OK
- Apostrophes dans Code nodes : utiliser guillemets doubles pour toutes les strings
- Apres PUT API : recharger la page avant d'ouvrir un noeud dans l'UI

---

## CONTACTS EQUIPE
- Pauline : enregistrement voix ElevenLabs (1 min) a planifier
- Vanessa Segretier : credentials Estale
- Salaries : Nolwenn Ribot, Giovanna Grantange, Maeva Gamyr
- Independantes : Angelique Tanic, Anne-Claire Chabalier, Christine Naja, Julie Tournu, Marie-Agnes Montout

---

## PRIORITES PROCHAINE SESSION
1. Badge IA Mail Actif > Vase clos dans index_final.html (10 min)
2. Validation Lea WA avec vrai coproprietaire identifie dans Supabase
3. ElevenLabs account + voix francaise + Pauline enregistrement 1 min
4. Twilio WhatsApp account + numero +590 Guadeloupe
5. IA Mail locatif@immoconseil-gpe.com (oublie CDC — dupliquer workflow syndic)
6. Activation IA Mail apres 10 tests E2E + validation Jeremy
7. Module 5 locatif : import Hektor Excel > Supabase (peut demarrer sans API Estale)
