# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 15/06/2026*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : Vérifier logs_demarchage email_destinataire après cron nuit — puis WhatsApp Twilio 2 337 contacts**

---

## STACK TECHNIQUE

- n8n Cloud Pro : immo-conseil-antilles.app.n8n.cloud — API key "Claude-Session-15" (Never expires)
- Supabase : xdrlgyqxdbdvzrneujgz — RLS activé 13 tables
- Vercel : ica-platform.vercel.app — commit actuel : ed157bd6
- GitHub : AIC-971/ica-platform — source: public/dashboard.html + public/index_final.html
- Vapi : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- ElevenLabs : voix Bella Multilingual v2 (à remplacer par clone voix Pauline — enregistrement 1 min en attente)
- Google Workspace : lea@immoconseil-gpe.com — agence@immoconseil-gpe.com (humain)
- GitHub token : ghp_***VOIR_N8N_CREDENTIAL*** (ICA-DreamWorker-2) (ICA-DreamWorker-2, pas d'expiration)
- Anthropic API credential n8n : SsmgpFAZCENDy5q2 — modèle claude-sonnet-4-5/4-6

---

## ROADMAP GLOBALE

P1 Dreaming ✅ | P2 Démarchage ✅ | P3 Alertes dashboard ✅ | P4 IA Mail vase clos ✅ | P5 Module2B PDF non activé | P6 Dashboard ✅ | P7 Vapi EN COURS | P8 WhatsApp Twilio ⬜ | P9 DVF+BODACC ANNULÉ | Scraping ARRÊTÉ

---

## WORKFLOWS N8N — ÉTAT AU 15/06/2026

### Démarchage (ID: NXvKhsUcjOl5zN8R) ✅ PUBLIÉ
- 20 271 contacts dont 885 copropriétaires Estale (source=estale_proprietaire)
- Parser Message CORRIGÉ le 15/06 : boucle for sur $input.all() et $('Claude Génère Message').all()[i] — plus de .first()
- email_destinataire dans Log Demarchage = $json.email (champ réel confirmé)
- **À VÉRIFIER au prochain cron** : email_destinataire non-NULL dans logs_demarchage
- Prompt enrichi copropriétaires : avantages progressifs J0/J+90/J+180

### SYNC Estale (ID: 9JmHqRKkjDx88qqw) ✅ PUBLIÉ, cron 2h
- 63 copropriétés syndic (GL exclu)
- 1171/1683 lots liés — 512 lots orphelins (~302 GL intentionnel)

### IA Mail 4 boîtes — UNPUBLISHED VOLONTAIREMENT
- syndic@ 9WLzlCKNGEn5B97B / service.juridique@ MMUAHW8vgEPd4UKo / service.technique@ SaxB3VWFwbZvCHHY / mf.berret@ kc6si9C7UTTnBYO9
- Chaîne validée vase clos — NE PAS PUBLIER sans 10 tests E2E + validation Jeremy

### Vapi (ID: x6XxHa9GXJfcw40p) ✅ PUBLIÉ, 19 nœuds
- 3 tools : chercher_info ✅ testé, creer_dossier_intervention, transfert_humain
- NE PAS brancher numéros SFR avant tests internes validés

### Dreaming (ID: EB1xXO82jojuUxMv) ✅ PUBLIÉ, cron 3h

---

## PLATEFORME ICA — dashboard.html — ÉTAT 15/06/2026

Commit actuel : **ed157bd6**

### Onglets et état
- Vue globale : ✅ données live — Prochaines AG FIXÉ (Array.isArray guard)
- Mails IA : ✅ 70 mails traités
- Copropriétés : ✅ FIXÉ — 60 copros, 7 AG/90j, 21 mandats expirés (fix prochaine_ag + Array.isArray)
- Démarchage : ✅
- Interventions : ✅
- Vapi/Appels : ✅ (0 appels — Vapi non branché)
- Propriétaires : ✅ 1148 propriétaires
- Activité Résidences : ✅ NOUVEAU 15/06 — flux mails/interventions/appels 7j par résidence

### Bugs résolus aujourd'hui (15/06)
- `copros.filter is not a function` → Array.isArray guards sur coprosRaw/lotsRaw/agListRaw/mandatsRaw
- `date_prochaine_ag` colonne inexistante → remplacé par `prochaine_ag` (14 occurrences)
- `mails_traites.copropriete_id` inexistant → remplacé par `boite` dans loadActivite
- index_final.html badge syndic@ corrigé "Vase clos"

---

## SUPABASE — COLONNES RÉELLES CONFIRMÉES

### coproprietes
id, estale_id, nom, adresse, commune, code_postal, territoire, nb_lots, gestionnaire_id, syndic_actuel, date_fin_mandat, actif, notes, created_at, updated_at, tantiemes_totaux, nb_lots_total, date_dernier_ag, budget_previsionnel, taux_impaye, estale_agency_id, date_derniere_ag, **prochaine_ag** (PAS date_prochaine_ag)

### mails_traites
id, gmail_message_id, boite, expediteur_email, expediteur_nom, sujet, corps_resume, categorie, urgence, decision, brouillon_genere, reponse_envoyee, date_reponse, gestionnaire_id, label_ia_en_traitement, annule_par_gestionnaire, created_at
⚠️ PAS de copropriete_id — utiliser `boite` pour identifier la boîte

### contacts_demarchage
id, email (pas email_contact), telephone, nom, prenom, source, scenario, type_communication, ... (37 colonnes)

### dossiers_interventions
a copropriete_id ✅, type_intervention, statut, canal_entree, boite_receptrice...

### appels_vocaux
Table vide (0 enregistrements — Vapi non branché)

### logs_demarchage
email_destinataire, canal, message_sujet, message_corps, statut_envoi, sequence_etape, contact_id, type_contact, created_at

---

## PROCHAINES ACTIONS PAR PRIORITÉ

### 🔴 Immédiat (dès ce soir / demain matin)
1. **Vérifier logs_demarchage** après cron nuit : `SELECT email_destinataire, canal, message_sujet FROM logs_demarchage ORDER BY created_at DESC LIMIT 5;` — doit être non-NULL

### 🟡 Court terme
2. **WhatsApp Business Twilio** — compte Twilio, numéro +1590 Guadeloupe, brancher branche WA dans NXvKhsUcjOl5zN8R pour 2 337 contacts sans email
3. **Clone voix ElevenLabs Pauline** — enregistrement 1 min à récupérer → clone → brancher sur assistant Vapi
4. **Séquence email copropriétaires Estale** — filtre source=eq.estale_proprietaire dans workflow démarchage

### 🟠 Moyen terme
5. **IA Mail publication progressive** — syndic@ en premier, mode brouillon, 10 tests E2E
6. **Module 2B PDF activation** — workflow 6oJ6ST7mjyeZGeZn, après classification prestataires
7. **Alertes Estale gestionnaires** (P3)

---

## DÉCISIONS PERMANENTES

- Scraping FB/LBC/PAP/Amivac : ARRÊTÉ DÉFINITIVEMENT
- DVF+BODACC : ANNULÉ DÉFINITIVEMENT
- IA Mail 4 boîtes : NE PAS PUBLIER sans validation complète Jeremy
- Tiers inconnu → TOUJOURS répondre courtoisement (Léa)
- GL = gestion locative → hors scope syndic, filtrer tout ce qui commence par "GL"
- Renvoi SFR = conditionnel (pas achat nouveaux numéros)
- Dimanche et 21h-03h → messagerie SFR existante (pas Vapi)

---

## CLÉS ET CREDENTIALS ACTIFS

| Service | Credential | Note |
|---------|-----------|------|
| n8n API | Claude-Session-15 | Never expires |
| GitHub | ghp_***VOIR_N8N_CREDENTIAL*** (ICA-DreamWorker-2) | ICA-DreamWorker-2 |
| Supabase SK | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...1gvVPGSBotPXP_U4_-lLGQ0SfG2HdzLNWY9mRUiSd-A | service_role |
| Anthropic | SsmgpFAZCENDy5q2 | n8n credential |
| Vapi | assistant d3997dfd-6122-477f-9f20-fbabfeaedf22 | PAYG |

---

## APPRENTISSAGES TECHNIQUES CLÉS

- `q()` Supabase retourne `{data: {code, message}, count: 0}` en cas d'erreur → toujours `Array.isArray(data) ? data : []`
- Table `coproprietes` : colonne AG = `prochaine_ag` (pas `date_prochaine_ag`)
- Table `mails_traites` : pas de `copropriete_id`, utiliser `boite` (syndic@, service.technique@...)
- n8n `runOnceForAllItems` : toujours boucler `$input.all()[i]` + `$('NomNoeud').all()[i]`, jamais `.first()`
- GitHub API PUT : encoder en base64 via FileReader+Blob (jamais btoa() direct)
- Vercel redéploie ~60-90s après push GitHub main
- Token Anthropic 503 Overloaded : ne pas enchaîner >3 exécutions manuelles consécutives (rate limit)
