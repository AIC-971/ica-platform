# SESSION_ICA_CONTEXT.md — ICA Platform
Derniere mise a jour : 30 juin 2026 (session autonome)

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
- BUG CRITIQUE RESOLU 30/06 : Preparer Log ne produisait que from_number, Envoyer Message WA lisait $json.from -> Bad Request. Fix : Preparer Log produit from ET from_number.
- A CONFIRMER au retour de Jeremy : renvoyer un message test, verifier conversations_whatsapp et historique_contacts se remplissent (dernier test avant fix = 0 row)
- Prompt 30/06 (retours Jeremy) :
  - VOUVOIEMENT par defaut, tutoiement uniquement si contact tutoie en premier + conversation avancee
  - IDENTIFICATION OBLIGATOIRE avant info sensible. Si non identifie -> demande nom + copropriete, ne dit jamais "pas acces"
  - DONNEES AG CABLEES (nouveau, session autonome 30/06) : Agreger Contexte interroge maintenant coproprietes.date_derniere_ag + prochaine_ag (deja sync via cron Estale 2h) des qu'un proprietaire est identifie. Si non identifie ou donnee NULL -> Lea transmet au gestionnaire, ne donne jamais l'info a un contact non identifie.
  - ATTENTION colonne legacy : date_dernier_ag (sans E) existe aussi dans coproprietes mais TOUJOURS NULL, ne pas utiliser. Les bonnes colonnes sont date_derniere_ag et prochaine_ag.

**SYNC Estale** 9JmHqRKkjDx88qqw — PUBLIE cron 2h

**Dream Worker** EB1xX082jojuUxMv — PUBLIE cron 3h

**Demarchage** NXvKhsUcjOl5zN8R — PUBLIE — 20271 contacts, 2337 sans email (source majoritaire hektor_archive, telephones format local 06XX/069X sans indicatif)

**Dashboard** ica-platform.vercel.app — commit 88961df

**Vapi Lea** — Assistant configure, ElevenLabs non configure, Pauline doit enregistrer ~2 min de voix

**Module 2B PDF** 6oJ6ST7mjyeZGeZn — NON ACTIVE (attend IA Mail)

**WhatsApp Templates Meta** — asset_id=1340658904686436 ("Immo Conseil Antilles", PAS 287601283294937 qui n'a pas les droits)
- ica_convocation_ag : APPROUVE / Actif
- ica_rappel_charges, ica_alerte_cyclone, ica_revision_loyer : en cours d'examen (soumis 29-30/06)

**NOUVEAU 30/06 — Workflow WA Sortant** ID 2LTunChjgvdAc7n2 — NON PUBLIE (cree en autonomie, a valider par Jeremy)
- Nom : "WA Sortant - Campagnes Templates Meta"
- 2 noeuds : Declenchement Manuel > Envoyer Campagne WA (Code)
- Logique : lit contacts_demarchage (email IS NULL, telephone NOT NULL, batch de 50), normalise le telephone (ajoute indicatif 590 Guadeloupe ou 596 Martinique selon colonne territoire), envoie le template Meta via Graph API, log dans historique_contacts (canal whatsapp, direction sortant)
- TEMPLATE_NAME est configure en dur dans le code (variable TEMPLATE_NAME en haut du Code node) -> a changer manuellement selon la campagne avant chaque execution
- ATTENTION IMPORTANTE : le code envoie actuellement UN SEUL parametre de template (prenom). Le template ica_convocation_ag a 4 variables ({{1}} nom, {{2}} copropriete, {{3}} date, {{4}} heure) -> le code doit etre complete avec les vraies donnees de copropriete avant utilisation reelle, sinon l'envoi echouera ou enverra des donnees incompletes. ica_rappel_charges et ica_revision_loyer ont aussi plusieurs variables. Seul un template a une seule variable serait utilisable tel quel actuellement.
- BATCH_SIZE = 50 par execution (securite, pas teste a plus grande echelle)
- NE PAS PUBLIER NI EXECUTER avant : 1) les 3 templates restants approuves par Meta, 2) le code adapte pour passer toutes les variables necessaires par template, 3) test sur un petit groupe controle, 4) validation Jeremy

---

## TABLE SUPABASE historique_contacts (creee 29/06)
- Table UNIFIEE tous canaux (WA + Mail + Vapi + sortant). Colonnes : identifiant, canal, direction, message_entrant, message_sortant, sujet, statut, proprietaire_id, copropriete_id, metadata, date_echange
- Fonction get_contexte_contact(TEXT) : GRANT TO anon + service_role

## STRUCTURE coproprietes (verifiee 30/06)
- date_derniere_ag (date) — REMPLIE, sync Estale
- prochaine_ag (date) — REMPLIE, sync Estale
- date_dernier_ag (date, sans E) — colonne legacy, TOUJOURS NULL, ne jamais utiliser

## STRUCTURE contacts_demarchage (verifiee 30/06)
- Colonnes cles : id, email, telephone, nom, prenom, source, scenario, type_communication, civilite, type_contact, ville, cp, territoire
- telephone en format local sans indicatif (ex: 0658908828), necessite normalisation avant envoi Meta API

---

## RESTE A FAIRE (ordre de priorite)

**PRIORITE HAUTE**
1. CONFIRMER fix log WA : message test + verification conversations_whatsapp/historique_contacts
2. Adapter le code du workflow WA Sortant (2LTunChjgvdAc7n2) pour passer toutes les variables de template necessaires (pas juste le prenom) — recuperer copropriete/date/montant selon le contexte de chaque template
3. Lea WA multi-contacts meme nom : LIMIT 1 sans confirmation identite — toujours pas traite

**MODULES INCOMPLETS**
4. IA Mail 4 boites : UNPUBLISHED — prerequis labels Gmail + 10 tests E2E + validation Jeremy
5. gestion.locative@ : EN ATTENTE Estale sep 2026 — NE PAS CREER avant
6. Module 2B PDF : s'active avec IA Mail
7. Vapi voix : Pauline enregistrement -> ElevenLabs -> Vapi
8. Publier workflow WA Sortant une fois templates approuves + code complete + tests

**LONG TERME**
9. Rapport Lea par copropriete pour AG
10. Depot rapport PDF Drive Estale (API GraphQL write)
11. Module 5 locatif : import Hektor Excel possible maintenant / reste attend Estale sep 2026

---

## ANNULE DEFINITIF
- DVF + BODACC — scraping LBC/PAP/Amivac/Facebook — FB Marketplace
- Module 6 Recrutement agents — Twilio (numero Meta existant suffit)

---

## BOITES MAIL ICA
- syndic@ : 9WLzlCKNGEn5B97B (UNPUBLISHED)
- service.juridique@ : MMUAHW8vgEPd4UKo (UNPUBLISHED)
- service.technique@ : SaxB3VWFwbZvCHHY (UNPUBLISHED)
- mf.berret@ : kc6si9C7UTTnBYO9 (UNPUBLISHED)
- gestion.locative@ : A CREER — attend Estale sep 2026

---

## PROCHAINE SESSION : commencer par
1. Confirmer fix log WA (message test + verification Supabase)
2. Revoir et valider le workflow WA Sortant cree en autonomie (2LTunChjgvdAc7n2) avant toute publication
3. Vapi voix si Pauline a enregistre
