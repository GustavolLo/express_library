const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to the server');
          const db = client.db(dbName);

          const col = await db.collection('users');

          const user = { username, password };
          const result = await col.insertOne(user);
          req.login(result.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error);
        }
        client.close();
      }());
    });

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });

  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signInView', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  return authRouter;
}

module.exports = router;
