"use strict";

const ObjectID = require("mongodb").ObjectID;

module.exports = {
  up(db) {
    const users = db.collection("users");

    // Update using foreach because we need to edit based on current value
    const updates = [];
    return users
      .find({})
      .forEach(doc =>
        updates.push(
          new Promise((res, rej) => {
            const newInterests = doc.interests
              .map(interest => interest.toLowerCase().trim())
              .filter(
                (interest, i, arr) => interest && arr.indexOf(interest) === i
              );

            return users
              .updateOne(
                { _id: doc._id },
                { $set: { interests: newInterests } }
              )
              .then(res)
              .catch(err => rej({ failedDoc: doc, err }));
          })
        )
      )
      .then(() =>
        Promise.all(updates)
          .then(results => console.log("Migration successful"))
          .catch(err => {
            console.log("Migration failed", err);
            throw Error();
          })
      );
  },

  down(db) {
    console.warn("No down migration");
  }
};
