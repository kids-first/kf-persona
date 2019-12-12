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

## migrations
- Library used for migration is migrate-mongo (https://www.npmjs.com/package/migrate-mongo).
- Migration scripts are run externally.
- Migration scripts used are located in : /kf-persona/migrations.
- To execute the scripts : `npm run migrate "<<migrate-mongo arguments>>"`
