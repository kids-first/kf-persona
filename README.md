# kf-persona

a kids-first instantiation of the persona microservice: https://github.com/kids-first/persona

## Development

- Make sure you have access to a mongoDB instance, preferably running locally
- Create a local `.env` file based on the provided schema in `.env.schema`
 
```
yarn --ignore-optional && \                                                                 
     yarn autoclean --init && \
     yarn autoclean --force && \
     yarn cache clean && yarn start
```
