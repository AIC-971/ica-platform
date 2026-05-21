# Playbook Lea — ICA Platform

> Mise a jour : 2026-05-21

## Compte et acces

- Email : lea@immoconseil-gpe.com
- Gmail Google Workspace : cree et operationnel
- Credential n8n : Gmail lea@ (ID: 3A09xfXHZJGIP5k3) type gmailOAuth2
- Role : Agent commercial IA — demarchage proprietaires et prospects

## Workflow demarchage (ID: NXvKhsUcjOl5zN8R)

- Statut : PUBLIE — a retester apres correction bug trim()
- Source : table contacts_demarchage (19 386 contacts)
- Filtre : contacts non demarchees depuis 90 jours
- IA : Claude Sonnet 4.6 genere 50 mails personnalises en 3min
- Envoi : Gmail lea@immoconseil-gpe.com
- Suivi : Trigger PostgreSQL maj_contact_apres_demarchage() sur logs_demarchage
- Probleme actif : bug trim() sur message_sujet — voir playbook_erreurs.md

## Templates mails valides

### Contacts Estale (proprietaires syndic)
- J0 : accroche syndic + double proposition transaction/GLI + autre projet
- J+90 : relance douce + apporteur affaires remunere
- J+180 : derniere tentative + offre bilan gratuit

### Archives Hektor
- Mandant : avantages exclusifs mandat
- Acquereur : marche evolue depuis votre achat
- Locataire : passage a lachat, moment opportun
- Tous : ouverture apporteur affaires remunere

### WhatsApp (contacts sans email — 2337 contacts)
- Version courte des mails Hektor
- A brancher via Twilio/Meta — Phase 2

## Contacts demarchage

| Source | Volume | Statut |
|---|---|---|
| hektor_archive | 13 879 | Charge |
| Estale proprietaires | 1 677 | Via sync lots |
| Total contacts_demarchage | 19 386 | Actif |
| Sans email (WhatsApp) | 2 337 | En attente Twilio |

## Regles quota

- Max 3 contacts commerciaux par an par contact (champ nb_commerciaux_annee)
- Type communication : commercial ou newsletter
- Index unique idx_dem_email_source (email, source)

## A faire

- Retester workflow apres fix trim() message_sujet
- Verifier premier mail envoye et reception Supabase log
- Brancher WhatsApp Twilio pour 2337 contacts sans email (Phase 2)
- Connecter Twilio Business API (Meta verification requise)
