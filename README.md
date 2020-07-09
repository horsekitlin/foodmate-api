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
SCC_STATE_SERVER_HOST= socket cluster state service host
SOCKETCLUSTER_PORT=socket cluster state service port
```

## start develop service

```
  $ yarn dev
```

## deploy develop service

[PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

[PM2 console](https://pm2.io/)

## Structor

```
.
├── Procfile
├── README.md
├── app.js
├── package.json
├── schemas
│   └── init_table.sql
├── src
│   ├── helpers
│   │   └── response.js
│   ├── models
│   │   └── mysqlConnectionPool.js
│   └── routes
│       └── roomRouter.js
└── yarn.lock
```

### app.js

起始的 檔案

### models

資料庫連結檔案

命名通常是 `xxxQueryies.js`

### helpers

元件庫

### routes

所有的routes

RESTFUL API 對應

* GET - 取資料
* POST - 新增資料
* PUT - 修改整筆資料
* PATCH - 修改資料中的某些欄位
* DELETE - 刪除資料 

