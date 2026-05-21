# CONTEXT SESSION ICA — Fichier de demarrage Claude

> Ce fichier est lu automatiquement par Claude au debut de chaque session.
> Mis a jour chaque nuit par le Dream Worker n8n (cron 3h).
> Source de verite : table ia_memory dans Supabase (xdrlgyqxdbdvzrneujgz)

---

## PHASE COURANTE

Phase 1 Dreaming COMPLETE (2026-05-21)
Phase 2 DemarchageLea EN COURS — bug trim() + WhatsApp Twilio

## ETAT DES COMPOSANTS

- Workflow demarchage Lea NXvKhsUcjOl5zN8R : PUBLIE a retester — bug trim() corrige pas encore teste
- Sync Estale Supabase 9JmHqRKkjDx88qqw : OK cron 2h 1677 proprietaires
- IA Mail syndic@ : BLOQUE chaine Gmail-Claude-Supabase cassee Phase 4
- ICA Platform : PARTIEL auth OK interventions OK module1 KO credits
- Dream Worker Ag9VOniwKSadQq94 : PUBLIE cron 3h matin
- ia_memory Supabase : ACTIVE 9 entrees + RLS + trigger

## BUGS ACTIFS PRIORITAIRES

1. bug_trim_lea (priorite 2) : trim() sur message_sujet. Fix : $input.first().json.text dans Parser Message. A retester.
2. ia_mail_bloque (priorite 2) : IA Mail syndic@ chaine cassee. Phase 4.

## PLAN 8 PHASES

P1 Dreaming : COMPLETE
P2 DemarchageLea : EN COURS
P3 SyncEstale + alCONTEXT_SESSION_ICA.mdertes
P4 IaMail syndic@
P5 Interventions PDF + Drive
P6 ICA Platform Module1 + RT
P7 Vapi + Twilio
P8 ProspectionFroide Apify + DVF + BODACC

## PLAYBOOKS DISPONIBLES

- /playbooks/playbook_n8n.md
- /playbooks/playbook_supabase.md
- /playbooks/playbook_lea.md
- /playbooks/playbook_erreurs.md

## INSTRUCTION POUR CLAUDE

Au debut de chaque session :
1. Ce fichier est deja lu (tu lis ceci)
2. Consulter ia_memory Supabase pour les mises a jour recentes du Dream Worker
3. Signaler a Jeremy l etat exact sans lui demander de reexpliquer
4. Proposer directement la suite selon la phase courante

URL ia_memory : https://xdrlgyqxdbdvzrneujgz.supabase.co/rest/v1/ia_memory?statut=eq.actif&order=priorite.asc

---
Derniere MAJ manuelle : 2026-05-21
Prochaine MAJ auto : Dream Worker 3h du matin
