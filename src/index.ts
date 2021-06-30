/* eslint-disable no-console */
import buildApp from './app';
import { port, keycloakUrl } from './env';
import connect from './services/mongo';
import { mailChimpSecrets } from './services/secrets';

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${reason}`);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log(`Process ${process.pid} has been interrupted`);
    process.exit(0);
});

const keycloakConfig = {
    realm: 'KidsFirst',
    'confidential-port': 0,
    'bearer-only': true,
    'auth-server-url': keycloakUrl,
    'ssl-required': 'external',
    resource: 'kf-api-variant-cluster',
};

connect()
    .then(() => {
        const app = buildApp(keycloakConfig, mailChimpSecrets);
        app.listen(port, () => console.log(`⚡️⚡️⚡️ Listening on port ${port} ⚡️⚡️⚡️`));
    })
    .catch((e) => {
        console.error('Error Connecting to mongo', e);
        process.exit(1);
    });
