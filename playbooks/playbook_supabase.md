# Playbook Supabase — ICA Platform

> Mise a jour : 2026-05-21

## Projet

- Ref : xdrlgyqxdbdvzrneujgz
- URL : https://xdrlgyqxdbdvzrneujgz.supabase.co
- Dashboard : https://supabase.com/dashboard/project/xdrlgyqxdbdvzrneujgz

## Tables principales

| Table | Rows approx | Usage |
|---|---|---|
| contacts_demarchage | 19 386 | Tous contacts toutes sources |
| lots | 1 677 | Sync Estale proprietaires |
| ia_memory | ~12 | Memoire IA projet |
| prospects | variable | Prospects commerciaux |
| prestataires | 639 | Intervenants dispatch |
| dossiers_interventions | variable | Suivi interventions |
| mails_traites | variable | Logs IA Mail |
| logs_workflows | variable | Logs n8n |

## Securite RLS

- RLS active sur 13 tables depuis 13/05/2026
- Politique service_role : acces complet a n8n
- Acces anon : revoque sur toutes les tables
- Cle a utiliser dans n8n : service_role (pas anon)

## Index importants

- idx_dem_email_source sur contacts_demarchage (domaine, cle)
- idx_ia_memory_domaine, idx_ia_memory_statut, idx_ia_memory_priorite
- UNIQUE (domaine, cle) sur ia_memory

## Triggers actifs

- maj_contact_apres_demarchage() : sur table logs_demarchage, met a jour contacts_demarchage apres envoi mail
- trg_ia_memory_updated : met a jour updated_at sur ia_memory

## Patterns

### Upsert sans conflit
POST /rest/v1/table?on_conflict=col1,col2
Header: Prefer: resolution=merge-duplicates

### Lecture filtree
GET /rest/v1/table?champ=eq.valeur&order=col.asc&select=col1,col2,col3

### Insert batch via n8n
Splitter en lots de 50, POST avec tableau JSON

## A faire

- Brancher table appels_vocaux quand Vapi actif (Phase 7)
- Creer vue rapport par copropriete (Phase 3)
- Dédoublonnage auto contacts sur imports Excel futurs
