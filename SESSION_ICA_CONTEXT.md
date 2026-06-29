# SESSION_ICA_CONTEXT.md — ICA Platform
Derniere mise a jour : 29 juin 2026

---

## STACK TECHNIQUE
- n8n Cloud Pro 2.25.7 : immo-conseil-antilles.app.n8n.cloud
- Supabase : xdrlgyqxdbdvzrneujgz — Vercel : ica-platform.vercel.app
- GitHub : AIC-971/ica-platform — Meta WhatsApp Cloud API
- Phone Number ID : 1241064202413162 — WABA : 1340658904686436
- Vapi Assistant : d3997dfd-6122-477f-9f20-fbabfeaedf22
- Cle API n8n active : Claude-Session-10 (never expires, ends K9Tg)
- Cle anon Supabase : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcmxneXF4ZGJkdnpybmV1amd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzA5NTMsImV4cCI6MjA1OTYwNjk1M30.lOzF44GIm6sH8PyIMdRAYtZB4HgTzTNqLgTzFVzYuRw

---

## MODULES OPERATIONNELS

**Lea WhatsApp** srE5JWjDsf0yDWN7 — PUBLIE
- Architecture : Webhook WA Messages (POST) > Parser WA > Agreger Contexte (Code) > Generer Reponse Lea > Extraire Reponse > Envoyer Message WA > Log Supabase WA (Code)
- Agreger Contexte : lit historique_contacts (tous canaux) + session recente + identifie proprietaire + lots Supabase
- Log Supabase WA (Code node) : ecrit dans conversations_whatsapp ET historique_contacts
- Prompt : texte brut, jamais markdown, jamais se presenter comme IA, jamais repeter Immo Conseil Antilles
- BUG NON RESOLU : log WA ne write pas en base (conversations_whatsapp = 0 row) — probleme de references croisees entre noeuds a investiguer
- PATTERN CRITIQUE : runOnceForAllItems + return [{json:{}}] OK
- this.helpers.httpRequest() pour tous les appels HTTP dans Code nodes
- Cle anon utilisable directement dans Code nodes (this.getCredentials() non dispo)

**SYNC Estale** 9JmHqRKkjDx88qqw — PUBLIE cron 2h — tourne depuis 19/06

**Dream Worker** EB1xXO82jojuUxMv — PUBLIE cron 3h — 16 entrees ia_memory

**Demarchage** NXvKhsUcjOl5zN8R — PUBLIE
- 20271 contacts — 2337 sans email
- Fix 29/06 : email_destinataire -> dollar-sign(Prospects A Demarcher).first().json.email

**Dashboard** ica-platform.vercel.app — commit 88961df
- 6 onglets, auth 3 roles, Module 8 + 9 OK, badge Vase clos OK (25/06)

**Vapi Lea** — Assistant d3997dfd configure, workflow x6XxHa9GXJfcw40p PUBLIE
- ElevenLabs non configure — SFR non connectes — Pauline doit enregistrer 2 min de voix

**Module 2B PDF** 6oJ6ST7mjyeZGeZn — NON ACTIVE (attend IA Mail)

---

## NOUVELLES TABLES SUPABASE (29/06)
- historique_contacts : table UNIFIEE tous canaux (WA + Mail + Vapi). Colonnes : identifiant, canal, direction, message_entrant, message_sortant, sujet, statut, proprietaire_id, copropriete_id, metadata, date_echange
- Fonction get_contexte_contact(TEXT) : retourne 20 derniers echanges tous canaux pour un identifiant. GRANT TO anon + service_role.
- Index : idx_historique_identifiant sur (identifiant, date_echange DESC)

---

## RESTE A FAIRE (ordre de priorite)

**PRIORITE HAUTE**
1. Lea WA log — BUG references croisees : conversations_whatsapp vide. Investiguer : passer toutes les donnees via payload Envoyer Message WA plutot que references $() entre noeuds
2. Lea WA memoire session : depend du fix #1
3. Lea WA multi-contacts meme nom : LIMIT 1 sans confirmation identite

**MODULES INCOMPLETS**
4. IA Mail 4 boites syndic/juridique/technique/mf.berret : UNPUBLISHED — prerequis labels Gmail + 10 tests E2E + validation Jeremy
5. gestion.locative@immoconseil-gpe.com : EN ATTENTE mise a jour Estale gestion locative (septembre 2026)
6. Module 2B PDF : s active avec IA Mail
7. Vapi voix : Pauline enregistrement 2 min -> ElevenLabs -> Vapi -> tester avant SFR
8. WA sortant Meta : templates Meta approuves (cyclone/AG/taxes/loyers) + workflow n8n avec credentials Meta existants (pas de Twilio)

**LONG TERME**
9. Rapport Lea par copropriete pour AG
10. Depot rapport PDF Drive Estale (API GraphQL write)
11. Module 5 locatif : import Hektor Excel possible maintenant / reste attend Estale sep 2026
12. Enrichissement Estale GraphQL temps reel dans Agreger Contexte (charges, incidents actifs)

---

## ANNULE DEFINITIF
- DVF + BODACC — scraping LBC/PAP/Amivac/Facebook — FB Marketplace
- Module 6 Recrutement agents — Twilio (numero Meta existant suffit)

---

## BOITES MAIL ICA
- syndic@ : workflow 9WLzlCKNGEn5B97B (UNPUBLISHED)
- service.juridique@ : MMUAHW8vgEPd4UKo (UNPUBLISHED)
- service.technique@ : SaxB3VWFwbZvCHHY (UNPUBLISHED)
- mf.berret@ : kc6si9C7UTTnBYO9 (UNPUBLISHED)
- gestion.locative@ : A CREER — attend Estale sep 2026

---

## PROCHAINE SESSION : commencer par
- Investiguer bug log WA (passer donnees via Set node entre Extraire Reponse et Envoyer Message WA)
- Ou passer a Vapi ElevenLabs si Pauline a enregistre
