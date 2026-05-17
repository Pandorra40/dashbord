# Tableau de bord

Dashboard personnel pour centraliser l'accès à vos services locaux (Jellyfin, Nginx, WikiJS, etc.).

## Fonctionnalités

- **Onglet Public** — services accessibles à tous
- **Onglet Système** — services d'administration
- **Mode édition** — ajouter, modifier, supprimer des services (protégé par mot de passe)
- **Icônes officielles** via [Simple Icons](https://simpleicons.org)
- **Données persistantes** stockées en JSON

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | Nuxt 4 + Vue 3 + Nuxt UI + Tailwind CSS |
| Backend | Nuxt server API (Node.js) |
| Données | JSON local |
| Containerisation | Docker + Docker Compose |

## Déploiement via Docker

### Prérequis

- Docker
- Docker Compose

### Lancer le projet

```bash
docker compose up -d
```

Le tableau de bord sera accessible sur **http://localhost:3025**.

### Changer le mot de passe

Modifiez `NUXT_ADMIN_PASSWORD` dans `docker-compose.yml` :

```yaml
environment:
  - NUXT_ADMIN_PASSWORD=votre-mot-de-passe
```

Puis relancez :

```bash
docker compose up -d --build
```

## Développement local

```bash
npm install
npm run dev
```

Accessible sur **http://localhost:3000**.

## Vibe coding

Ce projet a été entièrement vibecoder avec [Claude Code](https://claude.ai/code) (IA d'Anthropic). La vision, les choix fonctionnels et les orientations sont humains — le code a été généré par l'IA.
