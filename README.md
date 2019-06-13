# labs-node-js-boilerplate
Boilerplate repository for nodejs based LABS projects.

This boilerplats is built on nodejs and express. It includes an example that showcases
everything from how the app is set up to routing and validation.

## Development
Prerequisite: local MySQL server running

1. Clone repository
2. Install dependencies with npm install
3. Create .env-file in the root folder with these properties
````
   PORT=3000 #(or any other port you prefer)
   LOG_LEVEL=info #(trace, debug, info, warn, error, fatal, silent)
````
4. run ```npm run migrate:latest``` (this will migrate your mysql schemas to the latest version)
5. Run project with ```npm run dev```

## Documentation

Documentation for apis built from this boilerplate should be split into two sections. Project related information should be written in the README-file for the repository, and specific instructions for calling the api should be documented with Swagger which is included in the project by default.

### Tests

The project uses [mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/) for testing.

Running tests:

1. Create .env.test-file in the root folder with same settings as the regular .env but with a different port.
2. Run the command ```npm run test```

To run the tests on code-changes, use ```npm run test:watch```

All files following the *.test.js-syntax will be included.

## Deployment
TODO

## Docker

This app can be built using [docker](https://www.docker.com/). To do so, simply navigate to the root of the project and run:

```
docker build . -t [tag] && \
docker run -d \
-p [host-port]:[server-port] \
-e PORT=[server-port] \
-e SERVER_KEY=./assets/certificates/server.key \
-e SERVER_CERT=./assets/certificates/server.cert \
[tag]
```

Further, you can thus use [docker-compose](https://docs.docker.com/compose/) to orchestrate containers created from this repository (and other dockerized apps). When developing, we use [this](https://github.com/helsingborg-stad/labs-docker-compose) specific docker-compose file.
