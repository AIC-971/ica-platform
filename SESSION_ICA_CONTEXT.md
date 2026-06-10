# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 10/06/2026 — P3 Alertes fin mandat + sync date_fin_mandat depuis Estale*

---

## PROTOCOL DÉBUT DE SESSION

1. web_fetch https://raw.githubusercontent.com/AIC-971/ica-platform/main/SESSION_ICA_CONTEXT.md
2. Consulter ia_memory Supabase (Dream Worker MAJ quotidienne à 3h)
3. Reprendre sans demander à Jeremy de réexpliquer

**PRIORITÉ PROCHAINE SESSION : P7 Vapi → enregistrement Pauline (1 min) → clone ElevenLabs → brancher Vapi**

---

## STACK TECHNIQUE

- **n8n Cloud Pro** : immo-conseil-antilles.app.n8n.cloud — API key "Claude-Session-10" (Never expires, fin: BLtLR9K9Tg)
- **Supabase** : xdrlgyqxdbdvzrneujgz — RLS activé 13 tables
- **Vercel** : ica-platform.vercel.app — commit courant ec12257f
- **GitHub** : AIC-971/ica-platform — source: public/index_final.html
- **Vapi** : assistant Léa ID d3997dfd-6122-477f-9f20-fbabfeaedf22
- **ElevenLabs** : voix Bella Multilingual v2 (à remplacer par clone voix humaine)
- **Google Workspace** : lea@immoconseil-gpe.com (envoi IA auto) — agence@immoconseil-gpe.com (humain UNIQUEMENT — JAMAIS automatique)

---

## WORKFLOWS N8N — ÉTAT AU 10/06/2026

| ID | Nom | Statut | Notes |
|---|---|---|---|
| 9JmHqRKkjDx88qqw | SYNC Estale → Supabase owners (nightly) | ✅ PUBLIÉ | Cron 2h — 62 résidences, 1677 propriétaires |
| k5vfKezkdSJEBrEe | SYNC Estale → date_fin_mandat coproprietes | ✅ PUBLIÉ | Cron 3h — 59 copros PATCHées depuis serviceBook.mandate.end |
| rSe1NpkFmBepbdxz | Alertes — Fin de Mandat Syndic | ✅ PUBLIÉ | Cron 8h — seuils J-15/30/45/60 |
| NXvKhsUcjOl5zN8R | Module Démarchage — Pipeline Supabase | ✅ PUBLIÉ | Logs OK, email_destinataire/canal NULL à corriger |
| x6XxHa9GXJfcw40p | Léa Vapi — Webhooks & Mémoire Connectée | ✅ PUBLIÉ | 18 nœuds |
| EB1xXO82jojuUxMv | Dream Worker — IA Memory | ✅ PUBLIÉ | Cron 3h |
| 9WLzlCKNGEn5B97B | IA Mail - syndic@ | ⬜ UNPUBLISHED | Attente approbation Jeremy |
| MMUAHW8vgEPd4UKo | IA Mail - service.juridique@ | ⬜ UNPUBLISHED | |
| SaxB3VWFwbZvCHHY | IA Mail - service.technique@ | ⬜ UNPUBLISHED | |
| kc6si9C7UTTnBYO9 | IA Mail - mf.berret@ | ⬜ UNPUBLISHED | |

---

## ÉTAT FONCTIONNEL PLATEFORME ICA

- **Auth** : 3 rôles (admin/gestionnaire/commercial) ✅
- **Module Alertes** : fin de mandat syndic J-15/30/45/60, données exactes Estale ✅
- **Module Interventions** : 639 prestataires + dispatch n8n ✅
- **Module 2B** : clôture prestataire formulaire mobile ✅ — PDF non activé
- **Module 8 Commissions** : 6 catégories, TVA 8.5% ✅
- **Module 9 Conformité** : RSAC/CCI/RC Pro, relances auto ✅
- **Module 1 IA Mail** : NON fonctionnel (crédits épuisés)
- **Compte Jeremy** : agence@immoconseil-gpe.com / Jeremyaic971! / rôle direction

---

## DONNÉES SUPABASE — ÉTAT AU 10/06/2026

- **coproprietes** : 60 lignes propres, 59 avec date_fin_mandat depuis Estale (serviceBook.mandate.end)
- **proprietaires** : 1677 owners depuis Estale
- **contacts_demarchage** : 19 386 contacts (13 879 depuis hektor_archive)
- **alertes** : Conformité RSAC (45) + fin mandat syndic (dynamique quotidien)
- **ia_memory** : 16+ entrées

---

## CHAMP CLÉ ESTALE — date_fin_mandat

**GraphQL** : `serviceBook { mandate { end } }` → `condo.serviceBook.mandate.end`
**Exemple LES 2B** : "2026-06-29"
**Sync** : workflow k5vfKezkdSJEBrEe — cron 3h du matin

---

## ROADMAP ICA

| P | Item | Statut |
|---|---|---|
| P1 | Dreaming | ✅ |
| P2 | Démarchage | ✅ (fix auth + $json) — logs NULL email_destinataire/canal à corriger |
| P3 | Alertes Estale | ✅ fin mandat syndic J-15/30/45/60 |
| P4 | IA Mail 4 boîtes | ✅ unpublished (publication en attente) |
| P5 | Module 2B PDF | ✅ non activé |
| P7 | Vapi voix Léa | 🔄 enregistrement Pauline demain (1 min min) |
| P8 | WhatsApp Twilio | ⬜ 2337 contacts sans email |
| P9 | DVF+BODACC | ❌ ANNULÉ DÉFINITIVEMENT |

---

## PROCHAINES ÉTAPES (ordre priorité)

1. **P7 Vapi** : Pauline enregistre 1 min → upload ElevenLabs → clone → brancher → tests mobile → renvoi SFR
2. **Logs Démarchage NULL** : ouvrir nœud "Log envoi" → corriger email_destinataire, canal, message_sujet
3. **Lien copro↔lots** : estale_condo_id NULL sur table lots
4. **WhatsApp Twilio** : compte + numéro +1590 Guadeloupe
5. **Publier 4 workflows IA Mail** : 10 tests E2E + approbation Jeremy

---

## RÈGLES CRITIQUES

- agence@immoconseil-gpe.com = humain UNIQUEMENT — JAMAIS d'envoi auto
- P9 DVF+BODACC = ANNULÉ DÉFINITIVEMENT
- Scraping LBC/PAP/Amivac = ARRÊTÉ DÉFINITIVEMENT
- n8n Code node : this.helpers.httpRequest() UNIQUEMENT (pas fetch)
- IA Mail 4 boîtes : NE PAS PUBLIER sans approbation Jeremy
