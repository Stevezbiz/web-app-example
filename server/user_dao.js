'use strict';

const User = require('./user');
const db = require('./db');
const bcrypt = require('bcrypt');

const createUser = function (row) {
  const id = row.id;
  const name = row.name;
  const mail = row.mail;
  const hash = row.hash;
  return new User(id, name, mail, hash);
}

exports.getUser = function (mail) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USERS WHERE mail = ?"
    db.all(sql, [mail], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve(undefined);
      else {
        const user = createUser(rows[0]);
        resolve(user);
      }
    });
  });
};

exports.getUserById = function (id) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM USERS WHERE id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve(undefined);
      else {
        const user = createUser(rows[0]);
        resolve(user);
      }
    });
  });
};

exports.checkPassword = function (user, password) {
  console.log("hash of: " + password);
  let hash = bcrypt.hashSync(password, 10);
  console.log(hash);
  return bcrypt.compareSync(password, user.hash);
}