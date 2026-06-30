# SESSION_ICA_CONTEXT.md — ICA Platform
Derniere mise a jour : 30 juin 2026

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
- Architecture : Webhook WA Messages (POST) > Parser WA > Agreger Contexte (Code) > Generer Reponse Lea > Extraire Reponse > Preparer Log (Set) > [Envoyer Message WA + Log Supabase WA en parallele]
- Agreger Contexte : lit historique_contacts (tous canaux) + session recente + identifie proprietaire + lots Supabase
- BUG CRITIQUE RESOLU 29-30/06 : Preparer Log ne produisait que from_number, mais Envoyer Message WA lisait $json.from -> Bad Request, aucun message n'etait meme envoye. Fix : Preparer Log produit maintenant from ET from_number.
- Preparer Log connecte en PARALLELE vers Envoyer Message WA ET Log Supabase WA (pas en serie) pour eviter les references croisees entre noeuds
- Prompt corrige 30/06 (retours Jeremy) :
  - VOUVOIEMENT par defaut au premier contact et tant que la conversation n'est pas engagee. Tutoiement uniquement si le contact tutoie en premier ET conversation deja avancee.
  - IDENTIFICATION OBLIGATOIRE avant toute info sensible (charges, AG, dossier). Si contact non identifie dans Supabase -> Lea demande nom complet + copropriete avant de repondre. Ne dit jamais "je n'ai pas acces", dit qu'elle doit verifier le dossier.
- A VALIDER : envoyer un nouveau message test pour confirmer que conversations_whatsapp et historique_contacts se remplissent enfin (derniere verification = 0 row, AVANT le fix from/from_number)
- PATTERN CRITIQUE : runOnceForAllItems + return [{json:{}}] OK
- this.helpers.httpRequest() pour tous les appels HTTP dans Code nodes
- Cle anon utilisable directement dans Code nodes (this.getCredentials() non dispo)

**SYNC Estale** 9JmHqRKkjDx88qqw — PUBLIE cron 2h — tourne depuis 19/06

**Dream Worker** EB1xX082jojuUxMv — PUBLIE cron 3h — 16 entrees ia_memory

**Demarchage** NXvKhsUcjOl5zN8R — PUBLIE — 20271 contacts, 2337 sans email

**Dashboard** ica-platform.vercel.app — commit 88961df — badge Vase clos OK

**Vapi Lea** — Assistant configure, workflow x6XxHa9GXJfcw40p PUBLIE — ElevenLabs non configure, Pauline doit enregistrer ~2 min de voix (texte fourni)

**Module 2B PDF** 6oJ6ST7mjyeZGeZn — NON ACTIVE (attend IA Mail)

**WhatsApp Templates Meta** (30/06) — 4 templates soumis dans Gestionnaire WhatsApp (asset_id=1340658904686436, compte "Immo Conseil Antilles")
- ica_convocation_ag : APPROUVE / Actif
- ica_rappel_charges : en cours d'examen
- ica_alerte_cyclone : en cours d'examen (alerte categorie marketing ignoree, soumis quand meme en Utilitaire)
- ica_revision_loyer : en cours d'examen
- Textes ne mentionnent JAMAIS d'adresse email specifique (syndic@ etc) car chaque copropriete a un interlocuteur dedie different. Seule lea@ pourra etre generique a terme, quand Lea sera fiable sur toutes les coproprietes.
- IMPORTANT : le Gestionnaire WhatsApp par defaut (business_id=300358985052994&asset_id=287601283294937) pointe vers "Application WhatsApp Business" qui n'a PAS les droits. Le bon WABA est asset_id=1340658904686436 ("Immo Conseil Antilles").

---

## TABLE SUPABASE historique_contacts (creee 29/06)
- Table UNIFIEE tous canaux (WA + Mail + Vapi). Colonnes : identifiant, canal, direction, message_entrant, message_sortant, sujet, statut, proprietaire_id, copropriete_id, metadata, date_echange
- Fonction get_contexte_contact(TEXT) : retourne 20 derniers echanges tous canaux. GRANT TO anon + service_role.
- Index idx_historique_identifiant sur (identifiant, date_echange DESC)

---

## RESTE A FAIRE (ordre de priorite)

**PRIORITE HAUTE**
1. CONFIRMER le fix log WA : envoyer message test, verifier conversations_whatsapp et historique_contacts se remplissent (fix from/from_number deploye 30/06, pas encore reteste)
2. Lea WA multi-contacts meme nom : LIMIT 1 sans confirmation identite — toujours pas traite

**NOUVELLE TACHE PLANIFIEE 30/06 — Connexion Estale GraphQL pour donnees AG dans Lea WA**
- Contexte : Lea dit a juste titre qu'elle doit "verifier le dossier" pour les infos AG, car aujourd'hui elle n'a AUCUNE connexion reelle aux dates d'AG. Le noeud Agreger Contexte consulte uniquement Supabase (proprietaires, lots), jamais Estale GraphQL ni meme coproprietes.date_derniere_ag.
- A faire : dans le Code node "Agreger Contexte", apres identification du proprietaire+copropriete, ajouter une requete vers coproprietes.date_derniere_ag et prochaine_ag (deja sync via SYNC Estale cron 2h, pas besoin d'appeler Estale GraphQL en direct si la donnee est deja dans Supabase) OU requete Estale GraphQL directe via Vercel serverless function si la donnee n'est pas a jour dans Supabase.
- Attention : CORS bloque les appels Estale directs depuis browser/Supabase -> seul Vercel serverless peut interroger les deux APIs. Si Lea doit interroger Estale en temps reel (pas juste lire le sync), il faudra un endpoint Vercel intermediaire (ex: api/lea-estale-lookup.js) que le Code node n8n appelle.
- Inclure dans le prompt : ne donner la date d'AG que si proprietaire identifie ET donnee disponible ; sinon proposer de transmettre la demande au gestionnaire.

**MODULES INCOMPLETS**
3. IA Mail 4 boites syndic/juridique/technique/mf.berret : UNPUBLISHED — prerequis labels Gmail + 10 tests E2E + validation Jeremy
4. gestion.locative@immoconseil-gpe.com : EN ATTENTE mise a jour Estale gestion locative (septembre 2026) — NE PAS CREER avant
5. Module 2B PDF : s'active avec IA Mail
6. Vapi voix : Pauline enregistrement ~2 min -> ElevenLabs -> Vapi -> tester avant SFR
7. WA sortant Meta : workflow n8n d'envoi vers 2337 contacts sans email, a construire des que les 3 templates restants sont approuves (credentials Meta existants, pas de Twilio)

**LONG TERME**
8. Rapport Lea par copropriete pour AG
9. Depot rapport PDF Drive Estale (API GraphQL write)
10. Module 5 locatif : import Hektor Excel possible maintenant / reste attend Estale sep 2026

---

## ANNULE DEFINITIF
- DVF + BODACC — scraping LBC/PAP/Amivac/Facebook — FB Marketplace
- Module 6 Recrutement agents (supprime definitivement 25/06) — Twilio (numero Meta existant suffit)

---

## BOITES MAIL ICA
- syndic@ : workflow 9WLzlCKNGEn5B97B (UNPUBLISHED)
- service.juridique@ : MMUAHW8vgEPd4UKo (UNPUBLISHED)
- service.technique@ : SaxB3VWFwbZvCHHY (UNPUBLISHED)
- mf.berret@ : kc6si9C7UTTnBYO9 (UNPUBLISHED)
- gestion.locative@ : A CREER — attend Estale sep 2026

---

## PROCHAINE SESSION : commencer par
1. Confirmer fix log WA (message test + verification Supabase)
2. Connexion Estale GraphQL / Supabase pour donnees AG dans Lea WA
3. Vapi voix si Pauline a enregistre
