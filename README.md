# kf-persona

a kids-first instantiation of the persona microservice: https://github.com/kids-first/persona

## Development

- Make sure you have access to a mongoDB instance, preferably running locally
- Create a local `.env` file based on the provided schema in `.env.schema`
- `yarn && yarn start`.

## migrations

- `npm run migrate "<<migrate-mongo arguments>>"` (this wraps persona's `persona-scripts`) see https://github.com/kids-first/persona for more information
