# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 09/06/2026 — Fix auth Supabase démarchage + analyse voix ElevenLabs*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : P7 Vapi → re-enregistrement voix (min 60s) + clone ElevenLabs**

---

## STACK TECHNIQUE

- **n8n Cloud Pro** : immo-conseil-antilles.app.n8n.cloud — API key "Claude-Fix-2026" (Never expires, créée 09/06)
- **Supabase** : xdrlgyqxdbdvzrneujgz — RLS activé 13 tables
- **Vercel** : ica-platform.vercel.app — commit: ec12257f
- **GitHub** : AIC-971/ica-platform — source: public/index_final.html
- **Vapi** : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- **ElevenLabs** : voix Bella Multilingual v2 (à remplacer par clone voix humaine)
- **Google Workspace** : lea@immoconseil-gpe.com (envoi IA auto) — agence@immoconseil-gpe.com (humain UNIQUEMENT — JAMAIS automatique)

---

## ROADMAP

| P | Item | Statut |
|---|------|--------|
| P1 | Dreaming | ✅ COMPLET |
| P2 | Démarchage logs | ✅ COMPLET (fix auth 09/06) |
| P3 | Alertes Estale gestionnaires | ⬜ |
| P4 | IA Mail 4 boîtes | ✅ UNPUBLISHED volontaire |
| P5 | Module 2B rapport PDF | ✅ configuré, non activé |
| P6 | Platform Module 1 + RT | ⬜ |
| P7 | Vapi voix Léa | 🔄 PRIORITÉ ACTIVE |
| P8 | WhatsApp Twilio | ⬜ |
| P9 | Prospection froide DVF+BODACC | ⬜ |
| SYNC | Estale→Supabase | ✅ COMPLET 09/06 |

---

## SYNC ESTALE → SUPABASE (9JmHqRKkjDx88qqw) — ✅ COMPLET 09/06

- 60 lignes — 59/60 avec estale_id (manquant: LES ARAUCARIAS)
- 2 doublons supprimés: LES JARDINS DE PRIMAVERA + VILLAGE VIVA
- Contrainte UNIQUE: coproprietes_estale_id_key WHERE estale_id IS NOT NULL
- avec_ag: 38+ (sera ~58 après cron 2h)
- Formatter: runOnceForAllItems — GraphQL sans balance — this.helpers.httpRequest()
- Cookie Estale: $('Extraire Cookie').item.json.cookie

---

## VAPI / LÉA VOIX (P7 — PRIORITÉ ACTIVE)

- Assistant ID: d3997dfd-6122-477f-9f20-fbabfeaedf22
- Voix actuelle: ElevenLabs Bella Multilingual v2
- Modèle: Claude Haiku 4.5
- 3 tools: chercher_info (3555c59c) ✅, creer_dossier_intervention (80aebb2b), transfert_humain (7dd40782)
- Webhook: https://immo-conseil-antilles.app.n8n.cloud/webhook/vapi-events
- Workflow: x6XxHa9GXJfcw40p PUBLIÉ ✅

**Analyse voix 09/06 — fichiers trop courts (22-27s, min ElevenLabs = 60s) :**
- Pauline : SNR 31.7 dB — volume fort — F0 203 Hz → PREMIER CHOIX
- Marie-France : SNR 30.7 dB — F0 172 Hz — bonne alternative
- Sandrine : SNR 29.1 dB — volume faible — 36% silence → ÉCARTER

**Prochaines étapes :**
1. Pauline re-enregistre script 90s minimum (script fourni session 09/06)
2. Upload ElevenLabs → clone voix
3. Brancher clone sur Vapi d3997dfd
4. Tests internes mobile
5. Renvoi conditionnel SFR → Vapi (Jeremy côté SFR)

NE PAS brancher SFR avant tests validés.
Horaires: Lun-Sam 03h-21h | Transfert humain: Lun-Jeu 08h30-17h / Ven 08h30-13h

---

## IA MAIL 4 BOÎTES (UNPUBLISHED volontaire)

| syndic@ | 9WLzlCKNGEn5B97B | service.juridique@ | MMUAHW8vgEPd4UKo |
| service.technique@ | SaxB3VWFwbZvCHHY | mf.berret@ | kc6si9C7UTTnBYO9 |

NE PAS PUBLIER avant: module prestataires + labels Gmail + 10 tests E2E + approbation Jeremy

---

## DÉMARCHAGE (NXvKhsUcjOl5zN8R) ✅ PUBLIÉ

- 19 386 contacts — envoi depuis lea@immoconseil-gpe.com UNIQUEMENT
- agence@immoconseil-gpe.com = humain uniquement, JAMAIS automatique
- **Fix 09/06 :** "Supabase Log Demarchage" — clé anon → service_role (apikey + Authorization) → Authorization failed résolu depuis Jun 5
- logs_demarchage: 5 rows (Jun 2-4 OK, Jun 5-9 erreur → corrigé)
- **À vérifier:** nœuds "Log WhatsApp À Envoyer" + "Mettre à Jour Prospect" — même risque clé anon
- WhatsApp branch (2 337 contacts sans email) → Twilio/Meta à connecter

---

## DREAMING ✅ COMPLET

- Dream Worker: EB1xXO82jojuUxMv — cron 3h — PUBLIÉ
- ia_memory Supabase: 16 entrées + MAJ quotidienne

---

## PLATFORM ICA

- Auth 3 rôles ✅ | Interventions 639 prestataires ✅ | Module 2B ✅ | Module 8 ✅ | Module 9 ✅
- Module 1 IA Mail: NON fonctionnel (crédits consommés)
- Module 2B PDF: 6oJ6ST7mjyeZGeZn NON ACTIVÉ

---

## RÈGLES BUSINESS

- Tiers inconnu → TOUJOURS RÉPONDRE courtoisement
- Max 3 emails commerciaux/an par contact — lea@ uniquement
- agence@immoconseil-gpe.com = humain UNIQUEMENT — JAMAIS d'envoi automatique
- Ne jamais donner % honoraires spécifiques
- Un seul assistant Vapi pour tous numéros SFR
- Estimations: ne pas préciser si gratuite (successions = payantes)
- Scraping FB/LBC/PAP/Amivac: SUSPENDU DÉFINITIVEMENT

---

## RÈGLES IMMUABLES N8N

1. IA Mail: UNPUBLISHED — NE PAS PUBLIER sans approbation Jeremy
2. Scraping: SUSPENDU DÉFINITIVEMENT
3. Supabase HTTP Request: service_role dans apikey ET Authorization (jamais anon)
4. Code node HTTP: this.helpers.httpRequest() UNIQUEMENT
5. runOnceForAllItems: $input.all()[i] — jamais $json direct sur nœud non-adjacent
6. Conflit API/UI: recharger page après PUT API avant d'ouvrir nœud UI
