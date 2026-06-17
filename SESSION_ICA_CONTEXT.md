# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 17/06/2026*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : Vérifier le statut de la vérification entreprise Meta (soumise le 17/06, délai 2-10 jours ouvrés). Si validée, générer le token permanent, finaliser l'enregistrement du numéro WhatsApp avec PIN 6 chiffres, et activer webhook subscriptions. Sinon, attendre.**

---

## STACK TECHNIQUE

- n8n Cloud Pro : immo-conseil-antilles.app.n8n.cloud — API key Claude-WA-Setup (Never expires)
- Supabase : xdrlgyqxdbdvzrneujgz — RLS activé toutes tables + policies service_role_bypass
- Vercel : ica-platform.vercel.app — commit actuel : ed157bd6
- GitHub : AIC-971/ica-platform — token dans n8n credential (ICA-DreamWorker-2, pas d'expiration)
- Vapi : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- ElevenLabs : voix Bella Multilingual v2 (clone voix Pauline en attente)
- Google Workspace : lea@immoconseil-gpe.com — agence@immoconseil-gpe.com
- Anthropic API credential n8n : SsmgpFAZCENDy5q2

---

## ROADMAP GLOBALE

P1 Dreaming termine | P2 Demarchage termine bug log email corrige 17/06 | P3 Alertes dashboard termine | P4 IA Mail vase clos termine | P5 Module2B PDF non active | P6 Dashboard termine | P7 Vapi EN COURS | P8 WhatsApp Meta EN COURS verification entreprise soumise en cours examen | P9 DVF+BODACC ANNULE | Scraping ARRETE

---

## WHATSAPP BUSINESS API META — ETAT AU 17/06/2026

### App Meta creee
- Nom : ICA Messagerie Pro
- App ID : 1197733872504452
- Business : Agence Immo Conseil Antilles (ID : 300358985052994)

### Numero enregistre (statut En attente, debloque apres verification entreprise)
- +590 690 490 834 (mobile ICA Guadeloupe)
- Phone Number ID reel : 1241064202413162
- WhatsApp Business Account ID : 1340658904686436
- Profil : Immo Conseil Antilles / Services professionnels / https://immoconseil-gpe.com

### Webhook configure
- URL : https://immo-conseil-antilles.app.n8n.cloud/webhook/whatsapp-wa
- Token verification : ica-whatsapp-2026
- Statut : VALIDE (coche verte dans Meta)

### Workflow n8n WhatsApp PUBLIE
- Nom : Lea WhatsApp Webhook Meta
- ID : srE5JWjDsf0yDWN7
- Structure : Webhook vers Verification Meta ? vers Challenge GET ou OK + Parser WA POST

### Verification entreprise Meta SOUMISE statut EN COURS D'EXAMEN (17/06/2026)
- Delai annonce : 2 a 10 jours ouvres
- Pays : France
- Type entreprise : Entreprise privee
- Nom legal : Immo Conseil Antilles
- Adresse soumise : 9 Centre Commercial l'Etoile, Carrefour Blanchard, 97110 Pointe-a-Pitre, Guadeloupe
- Telephone de contact soumis : +33590381088 (ligne fixe Marina)
- Methode de confirmation choisie : E-mail (vers immoconseil-gpe.com)
- Document importe : Kbis ICA (Jeremy a uploade directement sur Meta)
- Meta n'a trouve AUCUNE correspondance dans les registres publics lors de la recherche auto (5 resultats proposes, aucun ne correspondait : Antilles Holding, M&M Conseils Antilles, MS Antilles, Media Conseil Antilles, Immo Conseil Clichy) d'ou la demande de documents manuels
- Action prochaine session : verifier si le statut est passe a Verifie sur la page Etape 3

### Architecture vocale confirmee
- 0690490834 : WhatsApp API Lea + appels vers renvoi SFR conditionnel vers Vapi vers Lea
- Marina 0590 38 10 88, Saint-Francois 0590 84 81 49, Martinique 0596 79 49 01 vers renvoi SFR vers Vapi
- Un seul assistant Vapi pour tous les numeros

### Securite Supabase reglee (16/06)
- copropietaires : RLS active + policy service_role_bypass (etait RLS=false)
- 6 autres tables : policies service_role_bypass ajoutees
- 0 table sans RLS ou sans policy

### Prochaines etapes WhatsApp (dans l'ordre, apres validation Meta)
1. Verifier statut verification entreprise (Etape 3)
2. Une fois verifie : terminer enregistrement numero avec PIN 6 chiffres (eviter sequences triviales)
3. Generer token permanent via Etape 1, section Token d'acces, bouton Generer un token
4. Activer webhook subscriptions dans Gestionnaire WhatsApp (toggle visible sur fiche numero)
5. Brancher branche WA dans NXvKhsUcjOl5zN8R pour 2337 contacts sans email
6. Renvoi conditionnel SFR vers Vapi sur 0690490834 + 3 lignes fixes (Jeremy gere SFR)

---

## WORKFLOWS N8N — ETAT AU 17/06/2026

Demarchage NXvKhsUcjOl5zN8R PUBLIE - bug Log Demarchage CORRIGE 17/06
SYNC Estale 9JmHqRKkjDx88qqw PUBLIE cron 2h
IA Mail syndic@ 9WLzlCKNGEn5B97B UNPUBLISHED
IA Mail juridique@ MMUAHW8vgEPd4UKo UNPUBLISHED
IA Mail technique@ SaxB3VWFwbZvCHHY UNPUBLISHED
IA Mail mf.berret@ kc6si9C7UTTnBYO9 UNPUBLISHED
Lea WhatsApp Webhook srE5JWjDsf0yDWN7 PUBLIE
Vapi webhooks x6XxHa9GXJfcw40p PUBLIE
Dreaming EB1xXO82jojuUxMv PUBLIE cron 3h

### Demarchage — Bug Log Demarchage CORRIGE ET PUBLIE (17/06/2026)
Root cause trouvee : node Supabase Log Demarchage (HTTP Request POST) utilisait des champs inexistants.
Avant (bugge) : email_destinataire prenait $json.email_contact ou $json.email qui n'existent pas dans la sortie du Parser Message.

Fix applique et PUBLIE, le body JSON est maintenant :
email_destinataire = $json.email_destinataire
canal = $json.canal_demarchage ou email par defaut
message_sujet = $json.message_sujet
message_corps = $json.message_corps tronque a 2000 caracteres
statut_envoi = envoye
sequence_etape = $json.sequence_etape ou 1
contact_id = $json.id
type_contact = $json.type_contact

Verification a faire prochaine session : relancer la requete SQL sur logs_demarchage trie par created_at desc apres le prochain cron nocturne pour confirmer que email_destinataire n'est plus NULL.

### Ecart proprietaires Estale vs Supabase — clarifie (17/06)
- contacts_demarchage avec source=estale_proprietaire = 885 contacts (table demarchage uniquement, avec email)
- proprietaires (table complete) = 1148 total (963 avec email, 185 sans email)
- Jeremy mentionne 1600+ dans Estale directement, ecart non resolu, connexion Estale en panne cote Jeremy au 17/06
- Action prochaine session : une fois Estale retabli, comparer le total reel Estale vs les 1148 Supabase et relancer SYNC si necessaire

---

## PLATEFORME ICA — dashboard.html — ETAT 15/06/2026

Commit actuel : ed157bd6

Onglets : Vue globale (prochaine_ag fixe, donnees live), Mails IA (70 mails traites), Coproprietes (60 copros, 7 AG sous 90j, 21 mandats expires), Demarchage, Interventions, Vapi/Appels (0 appels), Proprietaires (1148), Activite Residences (flux 7j par residence)

---

## SUPABASE — COLONNES REELLES CONFIRMEES

- coproprietes : colonne AG = prochaine_ag (pas date_prochaine_ag)
- mails_traites : pas de copropriete_id, utiliser boite
- contacts_demarchage : champ email = email (pas email_contact), champ canal = canal_demarchage
- logs_demarchage : email_destinataire, canal, message_sujet, message_corps, statut_envoi, sequence_etape, contact_id, type_contact, created_at
- proprietaires : 1148 total, 963 avec email, 185 sans email
- appels_vocaux : vide (Vapi non branche)

---

## PROCHAINES ACTIONS PAR PRIORITE

Immediat :
1. Verifier statut verification entreprise Meta (Etape 3, app 1197733872504452)
2. Verifier logs_demarchage email_destinataire non-NULL apres cron nocturne (fix du 17/06)

Court terme (apres validation Meta) :
3. Terminer enregistrement numero WhatsApp avec PIN 6 chiffres
4. Token permanent Meta
5. Activer webhook subscriptions dans Gestionnaire WhatsApp
6. Brancher branche WA dans NXvKhsUcjOl5zN8R (2337 contacts sans email)
7. Clone voix ElevenLabs Pauline vers Vapi
8. Renvoi conditionnel SFR sur 4 numeros (Jeremy gere)

Moyen terme :
9. Resoudre ecart proprietaires Estale (1148 Supabase vs 1600+ Estale annonces) une fois connexion Estale retablie
10. IA Mail publication progressive (syndic@ en premier, 10 tests E2E)
11. Sequence email coproprietaires Estale (source=eq.estale_proprietaire)
12. Module 2B PDF activation
13. Alertes Estale gestionnaires (P3)

---

## DECISIONS PERMANENTES

- Scraping LBC/PAP/Amivac/FB : ARRETE DEFINITIVEMENT
- DVF+BODACC : ANNULE DEFINITIVEMENT
- IA Mail 4 boites : NE PAS PUBLIER sans validation Jeremy
- Tiers inconnu : TOUJOURS repondre courtoisement (Lea)
- GL = gestion locative : hors scope syndic
- Renvoi SFR = conditionnel (pas achat nouveaux numeros)
- Dimanche et 21h-03h : messagerie SFR (pas Vapi)
- 0690490834 = WhatsApp Business API + renvoi appels SFR vers Vapi

---

## CLES ET CREDENTIALS ACTIFS

n8n API : Claude-WA-Setup (Never expires)
Supabase SK : dans n8n credential (service_role)
Anthropic : SsmgpFAZCENDy5q2 (n8n credential)
Vapi : d3997dfd-6122-477f-9f20-fbabfeaedf22 (PAYG)
Meta App ID : 1197733872504452 (ICA Messagerie Pro)
Meta WABA ID : 1340658904686436 (Immo Conseil Antilles)
Meta Phone ID : 1241064202413162 (+590 690 490 834)
Meta Webhook token : ica-whatsapp-2026
Twilio : Trial 15.50USD non utilise (Meta direct retenu)

---

## APPRENTISSAGES TECHNIQUES CLES

- q() Supabase retourne objet erreur, toujours verifier Array.isArray(data) avant filter/map/forEach
- coproprietes : prochaine_ag (pas date_prochaine_ag)
- mails_traites : pas de copropriete_id, utiliser boite
- n8n runOnceForAllItems : utiliser $input.all()[i], jamais .first()
- GitHub API PUT : encoder en base64 via FileReader+Blob (jamais btoa direct sur UTF-8)
- Vercel redeploie environ 60 a 90 secondes apres push GitHub main
- Meta : le nom de l'app ne peut pas contenir le mot WhatsApp (marque deposee)
- Meta PIN : refus possible si le compte business n'est pas encore verifie, Etape 3 obligatoire dans ce cas
- n8n API : le champ active est en lecture seule, ne pas l'inclure dans le POST de creation de workflow
- Meta verification entreprise : la recherche automatique dans les registres publics peut echouer meme pour une entreprise reelle et legitime, fallback sur import de document (Kbis) plus confirmation par email, SMS, appel, WhatsApp ou verification de domaine
- Edition JSON dans un node n8n (editeur CodeMirror) : cliquer dans le champ, utiliser Selection API JS (range.selectNodeContents) pour tout selectionner puis taper le nouveau contenu ; Ctrl+A seul ne fonctionne pas toujours dans cet editeur
