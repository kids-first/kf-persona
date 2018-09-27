'use strict';

module.exports = {
  up(db, next) {
    // update records    
    const users = db.collection('users');
    users.find({}).snapshot().forEach(
      doc => {
        const newInterests = doc.interests.map(interest => {
          return interest.toLowerCase().trim()
        })
        .filter((interest, i, arr) => arr.indexOf(interest) === i);
        
        doc.interests = newInterests;

        users.replaceOne({_id: doc._id}, doc)
        .then(msg => { 
          console.log('replace success', msg.result);     
          next();
        })
        .catch(err => console.warn('replace failed', err));
      }
    );

  },

  down(db, next) {
    console.warn('No down migration');
    next();
  }

};