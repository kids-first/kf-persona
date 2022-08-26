<p align="center">
  <img src="docs/kfdrc-logo-sm.png" alt="Kids First Portal" width="660px">
</p>

<p align="center">
  <a href="https://github.com/kids-first/kf-persona/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/kids-first/kf-portal-ui.svg?style=for-the-badge"></a>
</p>

# :smiley: kf-persona

> A user profile & identity management microservice.

This project was initially imported from https://github.com/overture-stack/persona but has diverted from it. 

## :nut_and_bolt: Development
Prerequisite(s) are:
- Docker
- Docker-Compose

### :pencil2: Environment Variables 
You need to create and `.env` file containing the environment variables needed. You can have a look at [the examples in the schema file](.env.schema).
For instance,
- **PORT**=3232
- **MONGO_HOST**=mongodb:27017
- **MONGO_DB**=dev
- **KEYCLOAK_URL**=https://kf-keycloak-qa.kf-strides.org/auth
- **KEYCLOAK_REALM**=kidsfirstdrc
- **KEYCLOAK_CLIENT**=portal-ui

### :runner: Running the service
To spin up persona server AND a local mongodb, simply do:
```
docker-compose up
```
If you only want to spin up persona alone
```
docker run --rm -it -u node -v ${PWD}:/app --workdir /app node:18.8-apline3.15 bash
# in the terminal
npm run <dev|start|...>
```

If you need to access mongodb shell (presuming that the container exists) do:
```
# Find mongo's container ID (suppose it is 59ee...)
docker exec -it 59ee bash
# In the terminal
root@59ee31cb61bf:/# mongosh
Current Mongosh Log ID:	6308f283661b1233ed4ffec1
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB:		5.0.2
Using Mongosh:		1.0.5

    ...omitted message display...

test> show dbs;
admin     41 kB
config  61.4 kB
dev     12.3 kB
local   73.7 kB
test> 
```

## :hammer: Building the project
```
# Build the service (no DB)
docker build -t persona .

# Run the service
docker run -it -p 3232:3232 --rm persona
# At this point, you should see the server message. If so, fire up another terminal and do
curl localhost:3232/status

# Cleanup
- exit the container (CTRL-C)
- docker rmi persona:latest
```