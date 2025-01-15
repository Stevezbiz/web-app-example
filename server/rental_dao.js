'use strict';

const Rental = require('./rental');
const db = require('./db');
const moment = require('moment');

const createRental = function (row) {
  const id = row.id;
  const initialDate = row.initialDate;
  const finalDate = row.finalDate;
  const category = row.category;
  const driverAge = row.driverAge;
  const additionalDrivers = row.additionalDrivers;
  const extraInsurance = row.extraInsurance;
  const kms = row.kms;
  const userId = row.userId;
  const plate = row.plate;
  return new Rental(id, initialDate, finalDate, category, driverAge,
    additionalDrivers, extraInsurance, kms, userId, plate);
}

exports.getPastRentals = function (user) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM RENTALS WHERE userId = ? AND initialDate <= ? ORDER BY initialDate";
    db.all(sql, [user, moment().format('YYYY-MM-DD')], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve([]);
      else {
        const rentals = rows.map((row) => createRental(row));
        resolve(rentals);
      }
    });
  });
};

exports.getFutureRentals = function (user) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM RENTALS WHERE userId = ? AND initialDate > ? ORDER BY initialDate";
    db.all(sql, [user, moment().format('YYYY-MM-DD')], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve([]);
      else {
        const rentals = rows.map((row) => createRental(row));
        resolve(rentals);
      }
    });
  });
};

exports.addRental = function (rental) {
  rental.initialDate = moment(rental.initialDate).format("YYYY-MM-DD");
  rental.finalDate = moment(rental.finalDate).format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO RENTALS(initialDate, finalDate, category, driverAge, additionalDrivers, extraInsurance, kms, userId, plate) VALUES(?,?,?,?,?,?,?,?,?)';
    db.run(sql, [rental.initialDate, rental.finalDate, rental.category,
    rental.driverAge, rental.additionalDrivers, rental.extraInsurance,
    rental.kms, rental.userId, rental.plate], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log(this.lastID);
        resolve(this.lastID);
      }
    });
  });
}

exports.deleteRental = function (id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM RENTALS WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err)
        reject(err);
      else
        resolve(null);
    })
  });
}