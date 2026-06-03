# SESSION ICA CONTEXT — Auto-genere Dream Worker
> Mis a jour chaque nuit par Dream Worker n8n (cron 3h du matin).
> Source de verite : table ia_memory Supabase (xdrlgyqxdbdvzrneujgz).
> Au demarrage de session : lire ce fichier + interroger ia_memory pour les MAJ recentes.

---

## REGLES IMMUABLES

1. IA Mail syndic@ : UNPUBLISHED — NE PAS PUBLIER avant prestataires + labels Gmail + 10 E2E + approbation Jeremy
2. Scraping FB/LBC/PAP/Amivac : SUSPENDU DEFINITIVEMENT — ne pas relancer
3. Jeremy valide tous les textes mail Lea avant prod
4. Tiers inconnu : TOUJOURS REPONDRE courtoisement jamais ignorer — decision Jeremy 06/2026
5. Supabase headers : service_role dans apikey ET Authorization jamais anon key
6. n8n PUT : settings = UNIQUEMENT executionOrder, staticData: null obligatoire

---

## WORKFLOWS (etat 03/06/2026)

- Demarchage Lea NXvKhsUcjOl5zN8R : Published OK logs NULL corriges resolveVars OK
- Sync Estale 9JmHqRKkjDx88qqw : Published OK cron 2h communes correctes postcode/city
- IA Mail syndic@ 9WLzlCKNGEn5B97B : UNPUBLISHED vase clos valide model claude-sonnet-4-5
- Dream Worker EB1xXO82jojuUxMv : Published OK cron 3h upsert ia_memory quotidien

---

## DONNEES SUPABASE (projet xdrlgyqxdbdvzrneujgz)

- contacts_demarchage : 19386 contacts (13879 Hektor)
- coproprietes : 62 residences communes correctes depuis Estale
- lots : 1677 proprietaires estale_condo_id NULL (lien copro-lots a etablir)
- ia_memory : memoire persistante cle UNIQUE 16+ entrees

---

## ARCHITECTURE IA MAIL (vase clos valide 06/2026)

Gmail Trigger → Code Preparer (filtre @immoconseil-gpe.com)
→ Contexte Estale Syndic → Chercher Coproprietaire + Historique Mails Supabase
→ Fusionner Contexte → Preparer Prompt Claude
→ Appel API Anthropic claude-sonnet-4-5 → Parser Claude
→ Switch Decision 4 branches :
  branch0=REPONDRE → Repondre Auto
  branch1=BROUILLON → Creer Brouillon
  branch2=ESCALADE → Alerte Escalade
  branch3=IGNORER → Mail Ignore
→ Logger Supabase → Gestion Prospect

---

## ROADMAP

P1 Dreaming OK | P2 Demarchage logs OK | P3 Alertes Estale TODO
P4 IA Mail vase clos OK | P5 Interventions PDF TODO
P6 Platform Module1 TODO | P7 Vapi/Twilio TODO | P8 Cold prospecting TODO

---

## TECH CRITIQUES

- Estale GraphQL : address.postcode (PAS zipCode) address.city
- Model Anthropic : claude-sonnet-4-5
- Supabase upsert : ?on_conflict=field + Prefer: resolution=merge-duplicates
- ia_memory : cle UNIQUE upsert via ?on_conflict=cle
- n8n API key : via hash trick Supabase settings → n8n settings API# CONTEXT SESSION ICA — Fichier de demarrage Claude

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
