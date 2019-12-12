//https://www.npmjs.com/package/migrate-mongo 7.0.1
//https://www.npmjs.com/package/md5 2.2.1

const md5 = require('md5');

module.exports = {
    async up(db) {
        const users = db.collection('users');
        const usersToUpdate = users.find({"email": {"$exists": true, "$nin": [null, "", " "]}});
        while (await usersToUpdate.hasNext()) {
            const doc = await usersToUpdate.next();
            await users.updateOne(
                {_id: doc._id},
                {$set: {"hashedEmail": md5(doc.email)}},
            )

        }
    },
    async down(db) {
        const users = db.collection('users');
        await users.updateMany(
            {"hashedEmail": {"$exists": true, "$nin": [null, "", " "]}},
            {$unset: {"hashedEmail": 1}},
        );
    }
};