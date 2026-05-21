# Playbook Erreurs — ICA Platform

> Mise a jour : 2026-05-21 | Document de reference pour toutes les erreurs connues

---

## ERREUR 001 — Bug trim() Workflow Demarchage Lea

- **Domaine** : n8n / Lea
- **Workflow** : NXvKhsUcjOl5zN8R Module Demarchage Pipeline Supabase
- **Statut** : CORRIGE dans le code — A RETESTER en prod
- **Symptome** : Noeud Envoyer Email echoue avec erreur trim() sur message_sujet
- **Cause** : Le noeud Parser Message utilisait une expression incorrecte pour lire le JSON de Claude
- **Solution** : Dans le noeud Parser Message, utiliser $input.first().json.text (et non .all() ou autre variante)
- **Test** : Executer le workflow manuellement sur 1 contact, verifier que le mail arrive sur lea@ et que Supabase est mis a jour via trigger

---

## ERREUR 002 — IA Mail syndic@ Chaine cassee

- **Domaine** : n8n / IA Mail
- **Workflow** : syndic@immoconseil-gpe.com
- **Statut** : BLOQUE — Phase 4
- **Symptome** : Le workflow tourne mais la chaine complete lecture Gmail vers Claude vers Supabase ne fonctionne pas
- **Cause** : Probleme de connexion entre les noeuds (non diagnostique)
- **Solution** : Ouvrir le workflow, executer noeud par noeud, verifier les sorties de chaque etape
- **Test** : Envoyer un mail test a syndic@, verifier que mails_traites est alimente dans Supabase

---

## ERREUR 003 — Sync Estale GraphQL n8n (RESOLUE)

- **Domaine** : n8n / Estale
- **Workflow** : 9JmHqRKkjDx88qqw Sync Estale Supabase
- **Statut** : RESOLUE — Workflow operationnel depuis mai 2026
- **Symptome** : Bug GraphQL bloquait la synchronisation
- **Solution** : Passage en POST HTTP direct avec on_conflict=estale_id au lieu de GraphQL
- **Resultat** : 1677 proprietaires synces dans table lots, cron 2h actif

---

## ERREUR 004 — $$ dollar-dollar dans SQL Supabase Editor

- **Domaine** : Supabase / SQL Editor
- **Statut** : CONNUE — Workaround disponible
- **Symptome** : Triggers avec syntaxe LANGUAGE plpgsql AS $$ ... $$ echouent dans l editeur
- **Cause** : L editeur Supabase interprete mal les doubles dollars dans certains contextes
- **Solution** : Utiliser la syntaxe LANGUAGE plpgsql AS 'BEGIN ... END;' (guillemets simples) ou passer par l API REST Supabase directement

---

## ERREUR 005 — Autocompletion GitHub bloque la saisie SQL

- **Domaine** : GitHub / Editeur web
- **Statut** : CONNUE — Comportement normal
- **Symptome** : En tapant du SQL dans l editeur GitHub, l autocompletion s ouvre et intercepte les caracteres
- **Solution** : Appuyer sur Escape pour fermer l autocompletion avant de continuer. Ou utiliser execCommand JavaScript pour injecter directement le contenu

---

## ERREUR 006 — RLS bloque les appels n8n anon

- **Domaine** : Supabase / RLS
- **Statut** : RESOLUE — 13/05/2026
- **Symptome** : Les workflows n8n ne pouvaient plus lire/ecrire dans Supabase apres activation RLS
- **Cause** : RLS active sans politique pour le role service_role
- **Solution** : Creer une politique service_role_full sur chaque table, utiliser la cle service_role (pas anon) dans les credentials n8n

---

## Template pour nouvelle erreur

Copier-coller ce bloc pour documenter une nouvelle erreur :

- **Domaine** : n8n / supabase / lea / ica / github
- **Workflow** : ID ou nom
- **Statut** : BLOQUE / EN COURS / RESOLUE / CONNUE
- **Symptome** : Ce qui se passe
- **Cause** : Pourquoi ca se passe
- **Solution** : Comment resoudre
- **Test** : Comment valider que c est resolu
