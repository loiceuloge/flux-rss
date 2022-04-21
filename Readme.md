# MINI PROJET FLUX RSS : PROGRAMME SOFTWARE ENGINEERING EDACY - DIGITAL

Creation d'un lecteur de flux RSS

---

## Description

Il s'agissait pour ce projet de créer un lecteur de flux rss du media à partir du flux du 'le monde' https://www.lemonde.fr/rss/en_continu.xml
Pour ce faire :

[Angular]

- Créer un application front-end de listing et d'edition des articles.
- Créer une Pagination
- Connecter l'application au back-end

[Node.js & Express.js & MongoDB]

- Créer une base de données
- Recupérer le contenu xml du flux, et le convertir en json
- Remplir la base de données à partir du nouveau flux
- Créer les differentes routes et controlleurs pour le listing et l'edition des articles.

[Deployement]

- Build le l'application front-end
- L'ajouter au backend
- Deployer l'application sur heroku https://le-monde-flux-rss.herokuapp.com/

---

## Prérequis

Pour la lancer l'application, vous aurez besoin d'installer Node.js, NPM et Angular

### [Node](http://nodejs.org/)

    $ node --version

### [NPM](https://www.npmjs.com/)

    $ npm --version

### [MongoDB](https://www.mongodb.com/)

Créer une base de données mongodb

---

## Installation du projet

    $ git clone https://github.com/loiceuloge/flux-rss.git
    $ cd flux-rss
    $ npm install

---

## Configuration

### Configurer l'application

Créer un fichier .env et definir les VARIABLES

- PORT :
- DB_URLDATABASE_PASSWORD :
- DATABASE :

### Remplir la base de données

    $ 		npm run migrate

### Lancer l'application

    $ 		npm start

### Lancer l'application en mode developement

    $ 		npm run dev
