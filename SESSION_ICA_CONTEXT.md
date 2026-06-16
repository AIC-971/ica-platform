# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 16/06/2026*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : Vérification entreprise Meta (Étape 3) → active numéro WhatsApp +590 690 490 834 → token permanent Meta → brancher branche WA dans workflow démarchage NXvKhsUcjOl5zN8R**

---

## STACK TECHNIQUE

- n8n Cloud Pro : immo-conseil-antilles.app.n8n.cloud — API key "Claude-WA-Setup" (Never expires)
- Supabase : xdrlgyqxdbdvzrneujgz — RLS activé toutes tables + policies service_role_bypass
- Vercel : ica-platform.vercel.app — commit actuel : ed157bd6
- GitHub : AIC-971/ica-platform — token dans n8n credential (ICA-DreamWorker-2, pas d'expiration)
- Vapi : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- ElevenLabs : voix Bella Multilingual v2 (clone voix Pauline en attente)
- Google Workspace : lea@immoconseil-gpe.com — agence@immoconseil-gpe.com
- Anthropic API credential n8n : SsmgpFAZCENDy5q2

---

## ROADMAP GLOBALE

P1 Dreaming ✅ | P2 Démarchage ✅ | P3 Alertes dashboard ✅ | P4 IA Mail vase clos ✅ | P5 Module2B PDF non activé | P6 Dashboard ✅ | P7 Vapi EN COURS | P8 WhatsApp Meta EN COURS (numéro enregistré, vérification entreprise manquante) | P9 DVF+BODACC ANNULÉ | Scraping ARRÊTÉ

---

## WHATSAPP BUSINESS API META — ÉTAT AU 16/06/2026

### App Meta créée ✅
- Nom : ICA Messagerie Pro
- App ID : 1197733872504452
- Business : Agence Immo Conseil Antilles (ID : 300358985052994)

### Numéro enregistré ✅ (statut "En attente")
- +590 690 490 834 (mobile ICA Guadeloupe)
- Phone Number ID réel : 1241064202413162
- WhatsApp Business Account ID : 1340658904686436
- Profil : "Immo Conseil Antilles" / Services professionnels / https://immoconseil-gpe.com

### Webhook configuré ✅
- URL : https://immo-conseil-antilles.app.n8n.cloud/webhook/whatsapp-wa
- Token vérification : ica-whatsapp-2026
- Statut : VALIDÉ (coche verte dans Meta)

### Workflow n8n WhatsApp ✅ PUBLIÉ
- Nom : Léa WhatsApp — Webhook Meta
- ID : srE5JWjDsf0yDWN7
- Structure : Webhook → Vérification Meta ? → Challenge (GET) / OK + Parser WA (POST)

### Architecture vocale confirmée
- 0690490834 : WhatsApp API (Léa) + appels → renvoi SFR conditionnel → Vapi → Léa
- Marina 0590 38 10 88, Saint-François 0590 84 81 49, Martinique 0596 79 49 01 → renvoi SFR → Vapi
- Un seul assistant Vapi pour tous les numéros

### Sécurité Supabase réglée (16/06) ✅
- copropietaires : RLS activé + policy service_role_bypass (était RLS=false)
- 6 autres tables : policies service_role_bypass ajoutées
- 0 table sans RLS ou sans policy

### Prochaines étapes WhatsApp
1. Vérification entreprise Meta Étape 3 (developers.facebook.com/apps/1197733872504452) → débloque activation
2. Générer token permanent → Étape 1 → "Token d'accès" → "Générer un token"
3. Activer webhook subscriptions dans Gestionnaire WhatsApp
4. Brancher branche WA dans NXvKhsUcjOl5zN8R pour 2337 contacts sans email
5. Renvoi conditionnel SFR → Vapi sur 0690490834 + 3 lignes fixes (Jeremy gère SFR)

---

## WORKFLOWS N8N — ÉTAT AU 16/06/2026

| Workflow | ID | État |
|----------|-----|------|
| Démarchage | NXvKhsUcjOl5zN8R | PUBLIÉ ✅ |
| SYNC Estale | 9JmHqRKkjDx88qqw | PUBLIÉ ✅ cron 2h |
| IA Mail syndic@ | 9WLzlCKNGEn5B97B | UNPUBLISHED |
| IA Mail juridique@ | MMUAHW8vgEPd4UKo | UNPUBLISHED |
| IA Mail technique@ | SaxB3VWFwbZvCHHY | UNPUBLISHED |
| IA Mail mf.berret@ | kc6si9C7UTTnBYO9 | UNPUBLISHED |
| Léa WhatsApp Webhook | srE5JWjDsf0yDWN7 | PUBLIÉ ✅ |
| Vapi webhooks | x6XxHa9GXJfcw40p | PUBLIÉ ✅ |
| Dreaming | EB1xXO82jojuUxMv | PUBLIÉ ✅ cron 3h |

**Démarchage :** Parser CORRIGÉ (boucle for sur $input.all()[i]) — email_destinataire = $json.email — vérifier non-NULL au prochain cron

---

## SUPABASE — COLONNES RÉELLES CONFIRMÉES

- coproprietes : prochaine_ag (PAS date_prochaine_ag)
- mails_traites : PAS de copropriete_id → utiliser boite
- contacts_demarchage : champ email = email (pas email_contact)
- logs_demarchage : email_destinataire, canal, message_sujet, statut_envoi, created_at
- appels_vocaux : vide (Vapi non branché)

---

## PROCHAINES ACTIONS PAR PRIORITÉ

1. Vérifier logs_demarchage email_destinataire non-NULL après cron
2. Vérification entreprise Meta Étape 3
3. Token permanent Meta
4. Brancher branche WA dans NXvKhsUcjOl5zN8R (2337 contacts sans email)
5. Clone voix ElevenLabs Pauline → Vapi
6. Renvoi conditionnel SFR (Jeremy gère)
7. IA Mail publication progressive (syndic@ en premier, 10 tests E2E)
8. Séquence email copropriétaires Estale (source=eq.estale_proprietaire)
9. Module 2B PDF activation
10. Alertes Estale gestionnaires (P3)

---

## DÉCISIONS PERMANENTES

- Scraping LBC/PAP/Amivac/FB : ARRÊTÉ DÉFINITIVEMENT
- DVF+BODACC : ANNULÉ DÉFINITIVEMENT
- IA Mail 4 boîtes : NE PAS PUBLIER sans validation Jeremy
- Tiers inconnu → TOUJOURS répondre courtoisement (Léa)
- GL = gestion locative → hors scope syndic
- Renvoi SFR = conditionnel (pas achat nouveaux numéros)
- Dimanche et 21h-03h → messagerie SFR (pas Vapi)
- 0690490834 = WhatsApp Business API + renvoi appels SFR → Vapi

---

## CLÉS ET CREDENTIALS ACTIFS

| Service | Valeur | Note |
|---------|--------|------|
| n8n API | Claude-WA-Setup | Never expires |
| Supabase SK | dans n8n credential | service_role |
| Anthropic | SsmgpFAZCENDy5q2 | n8n credential |
| Vapi | d3997dfd-6122-477f-9f20-fbabfeaedf22 | PAYG |
| Meta App ID | 1197733872504452 | ICA Messagerie Pro |
| Meta WABA ID | 1340658904686436 | Immo Conseil Antilles |
| Meta Phone ID | 1241064202413162 | +590 690 490 834 |
| Meta Webhook token | ica-whatsapp-2026 | |
| Twilio | Trial 15.50USD — non utilisé | Meta direct retenu |

---

## APPRENTISSAGES TECHNIQUES CLÉS

- q() Supabase retourne objet erreur → toujours Array.isArray(data) ? data : []
- coproprietes : prochaine_ag (pas date_prochaine_ag)
- mails_traites : pas de copropriete_id → utiliser boite
- n8n runOnceForAllItems : $input.all()[i] jamais .first()
- GitHub API PUT : FileReader+Blob pour base64 (jamais btoa() direct sur UTF-8)
- Vercel redéploie ~60-90s après push GitHub main
- Meta : nom app sans "WhatsApp" (marque déposée)
- Meta PIN : refus si compte business non vérifié → Étape 3 obligatoire
- n8n API : champ active en read-only → ne pas inclure dans POST workflow
