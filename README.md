# nodejs-simple-api
Very simple nodejs api server for the [Pirple Node.js Master course](https://pirple.thinkific.com/courses/the-nodejs-master-class)

# Clone
```sh
git clone https://github.com/kaskar2008/nodejs-simple-api.git
```

# Run

## Requirements
* [Node.js 8.x](https://nodejs.org/dist/v8.12.0/)

## Entry point
The main gate where you can start an application is `index.js` file. Default environment is `development`. You can set either `development` or `production` by setting `NODE_ENV` variable

```sh
node index.js

# or with NODE_ENV
NODE_ENV=production node index.js
```

# Available routes

## /user
### GET
Response:
```json
"Content-Type": "application/json"
"Body": {
  "ok": true,
  "message": "flawless"
}
```

### POST
Request:
```json
"Content-Type": "application/json"
"Body": {
  "test": null
}
```
Response:
```json
"Content-Type": "application/json"
"Body": {
  "test": null,
  "lilu": "my test middleware"
}
```

## /user/custom/handler/test
### GET
Response:
```json
"Content-Type": "text/plain"
"Body": "this is mine!"
```

## /ping
### GET
Response:
```json
"Content-Type": "application/json"
"Body": "ok"
```

## /hello
### GET
Request:
```json
"Query params": {
  "name": "string, optional"
}
```

Response:
```json
"Content-Type": "application/json"
"Body": {
  "message": "Welcome to my reality"
}
```
