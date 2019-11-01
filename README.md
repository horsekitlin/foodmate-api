# Foodmate API

Extends From [github](https://github.com/aszx87410/nodejs_simple_chatroom)

## Install

[Node version manager](https://github.com/nvm-sh/nvm)

```
  $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
  $ nvm install 10.16
  $ nvm use 10.16
  $ nvm alias default 10.16
```

[yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

```
  $ yarn install
```

## Env

```
  $ cp .env.example .env
```

```
 MYSQL_HOST= server ip
 MYSQL_PORT= server port
 MYSQL_USER= mysql user account
 MYSQL_PASSWORD= mysql user password
 MYSQL_DATABASE= mysql database name
```

## start develop service

```
  $ yarn dev
```

## deploy develop service

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
