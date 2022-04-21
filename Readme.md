# JULAYA CLIENT APPS MONO REPO

This is the mono repo containing the middleware API and the client facing website

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/) .
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v12.0.0

    $ npm --version
    5.0.0

---

### Yarn

Monorepo is installed using [yarn](https://github.com/yarnpkg/yarn).

- Packages are automatically linked together, meaning you can do cross-package work within the repo.
- `devDependencies` are common, and only appear in the root `package.json`. Easier to manage and upgrade.
- Each package has its own `scripts` and `dependencies`. They are being installed in the root `node_modules`, using the same deduping mechanism `yarn` uses for single packages.
- Adding new packages is as simple as dropping an existing package in the `packages` folder, and re-running `yarn`.

Installation

    $ npm install -g yarn

---

## Install project

    $ git clone https://github.com/dev-julaya/julaya-pro.git
    $ cd julaya-pro
    $ yarn install

---

## Included packages

- _@packages/api_

  The project containing the Middleware API. [Production url](https://api.julaya.co/)

* _@packages/common_

  A common utils and dependencies package. The package includes

  - Assets: images, fonts and styles.
  - Hooks: custom react hooks used across the different apps.
  - Store: a generic redux state management system containing all calls to the API as well internal events management.
  - utils: a set of common constants and functions used across the different apps.

- _@packages/app_

  A mobile only web app to access a Julaya account. This project is a replica of the old react native project. [Production url](https://app.julaya.co/)

* _@packages/pro_

  A web and desktop only app that allows enterprise level clients to manipulate their account. [Production url](https://pro.julaya.co/)

## Configuration

### Configure the api

Open `packages/api/.env` for development then edit them with your settings. You will need:

- NODE_ENV : local | production | develop
- PORT :
- DB_URL :
- DB_LOGGING :
- SEND_PASSWORD :
- CLIENT_ID :
- CLIENT_SECRET :
- CORE_API_URL :

### Configure the app

Open `packages/app/.env` for production and `packages/app/.env.develop` for development then edit them with your settings. You will need:

- REACT_APP_API_URL :
- REACT_APP_SECRET :
- REACT_APP_ENV : production | develop
- REACT_APP_GOOGLE_ANALYTICS :
- REACT_APP_HOTJAR_KEY :
- REACT_APP_CRISP_WEBSITE_ID :
- REACT_APP_PLATFORM : app
- REACT_APP_CP_CB_URL :
- REACT_APP_CP_API_KEY :
- REACT_APP_CP_SITE_ID :
- REACT_APP_CP_SCRIPT_URL :
- REACT_APP_PD_INVOICE_URL :
- REACT_APP_PD_JQUERY_URL :
- REACT_APP_PD_SCRIPT_URL :
- REACT_APP_PD_STYLE_URL :

### Configure the pro

Open `packages/pro/.env` for production and `packages/pro/.env.develop` for development then edit them with your settings. You will need:

- REACT_APP_API_URL:
- REACT_APP_SECRET:
- REACT_APP_ENV: production | develop`
- REACT_APP_GOOGLE_ANALYTICS:
- REACT_APP_HOTJAR_KEY:
- REACT_APP_CRISP_WEBSITE_ID:
- REACT_APP_PLATFORM: pro

## Frontend dev

### Start dev environment & watch with .env.develop variables

    $ cd packages/<app>|<pro> && yarn dev

### Start dev environment & watch with .env variables

    $ cd packages/<app>|<pro> && yarn start

### Simple build with .env.develop variables (develop)

    $ cd packages/<app>|<pro> && yarn build:develop

### Simple build with .env variables (production)

    $ cd packages/<app>|<pro> && yarn build

## API dev

### Start the environment & watch with .env variables

    $ cd packages/api && yarn dev

## Fullstack dev

### Start all processes & watch with local ENV variables

    $ yarn local:all

### Start API, PRO and APP processes & watch with develop variables

    $ yarn dev:all

### Start the API and a specific frontend with local ENV variables

    $ yarn local:all:<app>|<pro>

### Start the API and a specific frontend with develop ENV variables

    $ yarn dev:all:<app>|<pro>
