# SESSION_ICA_CONTEXT.md — Immo Conseil Antilles
*Dernière mise à jour : 09/06/2026 — P9 DVF+BODACC annulé + fix $json expressions Envoyer Email*


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
| P9 | Prospection froide DVF+BODACC | ❌ ANNULÉ DÉFINITIVEMENT |
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
