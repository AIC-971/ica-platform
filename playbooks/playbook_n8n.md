# Playbook n8n — ICA Platform

> Mise a jour : 2026-05-21

## Workflows actifs

| ID | Nom | Statut | Cron |
|---|---|---|---|
| NXvKhsUcjOl5zN8R | Module Demarchage Supabase | Publie | Manuel |
| 9JmHqRKkjDx88qqw | Sync Estale Supabase | Publie | 2h |
| Ag9VOniwKSadQq94 | Dream Worker Memoire ICA | Publie | 3h matin |

## Credentials

| ID | Nom | Type |
|---|---|---|
| SsmgpFAZCENDy5q2 | Anthropic account | anthropicApi |
| aX0VKgSKettBmnhE | Anthropic API Header | httpHeaderAuth |
| vgPcbgMbS6A2cBIb | Supabase account | supabaseApi |
| 3A09xfXHZJGIP5k3 | Gmail lea@ | gmailOAuth2 |
| 1R7pvRvcviXVCwop | Gmail syndic@ | gmailOAuth2 |

## Bugs connus

**BUG trim lea** : Noeud Envoyer Email plante sur trim() message_sujet. Fix : $input.first().json.text dans Parser Message. A retester en prod.

**BUG ia_mail_syndic** : Chaine Gmail vers Claude vers Supabase cassee. Phase 4 a debugger.

## Patterns valides

**UPSERT Supabase** : POST /rest/v1/table?on_conflict=col avec Header Prefer: resolution=merge-duplicates

**BATCH** : SplitInBatches 50 items max avant HTTP Request Supabase pour eviter timeouts

**TRIGGER PG** : Trigger PostgreSQL sur table remplace noeud MAJ qui peut echouer silencieusement

## A faire

- P2 Retester demarchage apres fix trim
- P2 Brancher WhatsApp Twilio 2337 contacts sans email
- P4 Debugger IA Mail syndic
- P7 Integrer Vapi appels entrants sortants
