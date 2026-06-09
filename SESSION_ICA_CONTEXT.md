# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 09/06/2026 — Sync Estale complète + remapping estale_id*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : P7 Vapi → clone voix ElevenLabs + numéro téléphone**

---

## STACK TECHNIQUE

- **n8n Cloud Pro** : immo-conseil-antilles.app.n8n.cloud — 10 000 exec/mois — API key "Claude-Fix-Temp" expire 28/06/2026
- **Supabase** : xdrlgyqxdbdvzrneujgz — RLS activé 13 tables — clé: [voir userMemories Claude]
- **Vercel** : ica-platform.vercel.app — commit: ec12257f — auto-deploy GitHub main
- **GitHub** : AIC-971/ica-platform — source: public/index_final.html
- **Vapi** : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- **ElevenLabs** : voix Bella Multilingual v2 connectée Vapi
- **Google Workspace** : lea@immoconseil-gpe.com + agence@immoconseil-gpe.com

---

## ROADMAP

| P | Item | Statut |
|---|------|--------|
| P1 | Dreaming (ia_memory + Dream Worker) | ✅ COMPLET |
| P2 | Démarchage logs | ✅ COMPLET |
| P3 | Alertes Estale gestionnaires | ⬜ |
| P4 | IA Mail 4 boîtes vase clos | ✅ UNPUBLISHED volontaire |
| P5 | Module 2B rapport PDF | ✅ configuré, non activé |
| P6 | Platform Module 1 + RT | ⬜ |
| P7 | Vapi voix Léa | 🔄 PRIORITÉ ACTIVE |
| P8 | WhatsApp Twilio | ⬜ |
| P9 | Prospection froide DVF+BODACC | ⬜ |
| SYNC | Estale→Supabase coproprietes estale_id | ✅ COMPLET 09/06 |

---

## SYNC ESTALE → SUPABASE (9JmHqRKkjDx88qqw) — ✅ COMPLET 09/06/2026

### État table coproprietes
- **60 lignes** (2 doublons supprimés : LES JARDINS DE PRIMAVERA + VILLAGE VIVA)
- **59/60** avec vrai estale_id Estale (manquant : LES ARAUCARIAS — absente cache Apollo)
- **Contrainte UNIQUE** : CREATE UNIQUE INDEX coproprietes_estale_id_key ON coproprietes(estale_id) WHERE estale_id IS NOT NULL
- **avec_ag** : 38+ (sera ~58 après prochain cron 2h du matin)
- **Cron 2h** : timeout 300s — suffisant pour 60 GraphQL + 60 PATCHs
- **Exécution manuelle** : timeout 60s — trop court, normal

### Architecture Formatter (code final fonctionnel)
- Mode: runOnceForAllItems
- Pour chaque item HTTP Request: récupère condo_id via pairedItem → $('Filtrer GL + Split par condo').all()[pIdx].json.condo_id
- **Fait sa propre requête GraphQL** sans balance (query propre: name + meetings{startAt isFutur} + address)
- Cookie Estale: $('Extraire Cookie').item.json.cookie
- PATCH Supabase via this.helpers.httpRequest()
- isFutur:false → date_derniere_ag / isFutur:true → prochaine_ag

### Règles critiques n8n Code node
- fetch() = INDISPONIBLE
- $http.request() = INDISPONIBLE
- **this.helpers.httpRequest() = SEUL HTTP disponible**
- $input.item.json = indisponible en runOnceForAllItems → utiliser $input.all()[i].json
- Accès nœud non-adjacent: $('NomNoeud').all()[pairedItem.item].json

### Remapping estale_id (fait le 09/06)
- UUIDs récupérés depuis localStorage['apollo-cache-persist'] sur estale.app (cache Apollo)
- SQL exécuté: DROP CONSTRAINT → UPDATE NULL → UPDATE CASE (59 noms→UUIDs) → CREATE UNIQUE INDEX
- Doublons Supabase supprimés: LES JARDINS DE PRIMAVERA (2 lignes) + VILLAGE VIVA (2 lignes)

---

## VAPI / LÉA VOIX (P7 — PRIORITÉ ACTIVE)

- Assistant ID: d3997dfd-6122-477f-9f20-fbabfeaedf22
- First message: "Agence Immo Conseil, bonjour, comment puis-je vous aider ?"
- Voix: ElevenLabs Bella Multilingual v2
- Modèle: Claude Haiku 4.5
- 3 tools configurés: chercher_info (3555c59c) ✅ testé, creer_dossier_intervention (80aebb2b), transfert_humain (7dd40782)
- Webhook: https://immo-conseil-antilles.app.n8n.cloud/webhook/vapi-events
- Workflow Léa Vapi: x6XxHa9GXJfcw40p PUBLIÉ ✅

**Prochaines étapes (ordre impératif) :**
1. Clone voix ElevenLabs (1 min enregistrement voix humaine réelle)
2. Numéro téléphone sur Vapi
3. Tests internes depuis mobile
4. Renvoi conditionnel SFR → Vapi (côté SFR, fait par Jeremy)

NE PAS brancher SFR avant tests internes validés.
Horaires Vapi: Lun-Sam 03h-21h | Transfert humain: Lun-Jeu 08h30-17h / Ven 08h30-13h

---

## IA MAIL 4 BOÎTES (toutes UNPUBLISHED volontaire)

| Boîte | Workflow ID |
|-------|-------------|
| syndic@ | 9WLzlCKNGEn5B97B |
| service.juridique@ | MMUAHW8vgEPd4UKo |
| service.technique@ | SaxB3VWFwbZvCHHY |
| mf.berret@ | kc6si9C7UTTnBYO9 |

Chaîne: Gmail→Supabase→Claude (claude-sonnet-4-5)→4 branches
NE PAS PUBLIER avant: module prestataires + labels Gmail + 10 tests E2E + approbation Jeremy
Règle: tiers inconnu → TOUJOURS RÉPONDRE courtoisement

---

## DÉMARCHAGE (NXvKhsUcjOl5zN8R) ✅ PUBLIÉ

- 19 386 contacts (13 879 hektor_archive)
- logs_demarchage: 5 rows — email/canal/sujet encore NULL dans "Log envoi" → à corriger
- WhatsApp branch (2 337 sans email) → Twilio/Meta à connecter

---

## DREAMING ✅ COMPLET

- Dream Worker: EB1xXO82jojuUxMv — cron 3h — PUBLIÉ
- ia_memory Supabase: 16 entrées + MAJ quotidienne

---

## PLATFORM ICA

- Auth 3 rôles ✅ | Interventions 639 prestataires ✅ | Module 2B ✅ | Module 8 ✅ | Module 9 ✅
- Module 1 IA Mail: NON fonctionnel (crédits consommés)
- Module 2B PDF: 6oJ6ST7mjyeZGeZn NON ACTIVÉ — Vercel api/generate-rapport-pdf.js déployé

---

## RÈGLES BUSINESS

- Tiers inconnu → TOUJOURS RÉPONDRE courtoisement
- Max 3 emails commerciaux/an par contact
- Envoi démarchage: agence@immoconseil-gpe.com uniquement
- Ne jamais donner % honoraires spécifiques
- Un seul assistant Vapi pour tous numéros SFR
- Estimations: ne pas préciser si gratuite (successions = payantes)
- Scraping FB/LBC/PAP/Amivac: SUSPENDU DÉFINITIVEMENT — ne pas relancer

---

## REGLES IMMUABLES N8N

1. IA Mail syndic@: UNPUBLISHED — NE PAS PUBLIER sans approbation Jeremy
2. Scraping FB/LBC/PAP/Amivac: SUSPENDU DÉFINITIVEMENT
3. Tiers inconnu: TOUJOURS RÉPONDRE courtoisement
4. Supabase headers: service_role dans apikey ET Authorization (jamais anon key)
5. n8n PUT API: settings = {executionOrder, saveManualExecutions, callerPolicy, timezone, saveDataSuccessExecution, saveDataErrorExecution, saveExecutionProgress} + staticData: null
6. Code node HTTP: this.helpers.httpRequest() UNIQUEMENT
