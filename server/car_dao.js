'use strict';

const Car = require('./car');
const db = require('./db');
const moment = require('moment');

const createCar = function (row) {
  const plate = row.plate;
  const model = row.model;
  const brand = row.brand;
  const category = row.category;
  return new Car(plate, model, brand, category);
}

exports.getCar = function (plate) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM CARS WHERE plate = ?";
    db.all(sql, [plate], (err, rows) => {
      if (err)
        reject(err);
      else if (rows.length === 0)
        resolve(undefined);
      else {
        const car = createCar(rows[0]);
        resolve(car);
      }
    });
  });
};

exports.getCars = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM CARS";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        let cars = rows.map((row) => createCar(row));
        resolve(cars);
      }
    });
  });
};

exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT category FROM CARS";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        let categories = rows;
        resolve(categories);
      }
    });
  });
};

exports.getBrands = function () {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT brand FROM CARS";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        let brands = rows;
        resolve(brands);
      }
    });
  });
};

exports.getCarNumberAndPlate = function (user, category, initialDate, finalDate) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as carNumber, plate FROM CARS WHERE category = ? AND plate NOT IN (SELECT plate FROM RENTALS WHERE initialDate <= ? AND finalDate >= ?)";
    let initDate = new Date(initialDate);
    initDate = initDate.toISOString();
    let finDate = new Date(finalDate);
    finDate = finDate.toISOString();
    db.all(sql, [category, finalDate, initialDate], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        let data = rows[0];
        resolve(data);
      }
    });
  });
};

exports.getPrice = function (user, category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT price FROM PRICES";
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const prices = rows.map((p) => p.price);
        const sql = "SELECT COUNT(*) as carNumber FROM CARS WHERE category = ? AND plate NOT IN (SELECT plate FROM RENTALS WHERE initialDate <= ? AND finalDate >= ?)";
        db.all(sql, [category, finalDate, initialDate], (err, rows) => {
          if (err) {
            reject(err);
          }
          else {
            const carNumber = rows[0].carNumber;
            if (carNumber > 0) {
              const sql = "SELECT COUNT(*) as cars FROM CARS WHERE category = ?";
              db.all(sql, [category], (err, rows) => {
                if (err) {
                  reject(err);
                }
                else {
                  const carInGarage = 100 * carNumber / rows[0].cars;
                  const sql = "SELECT COUNT(*) as rentalNumber FROM RENTALS WHERE userId = ? AND finalDate < ?";
                  db.all(sql, [user, moment().format('YYYY-MM-DD')], (err, rows) => {
                    if (err)
                      reject(err);
                    else {
                      const rentalNumber = rows[0].rentalNumber;
                      const price = calculatePrice(prices, category, initialDate, finalDate, kms, driverAge, additionalDrivers, extraInsurance, carInGarage, rentalNumber);
                      resolve(price);
                    }
                  });
                }
              });
            }
            else {
              resolve("Car not available");
            }
          }
        });
      }
    });
  });
};

const calculatePrice = function (prices, category, initialDate, finalDate, kms, driverAge, additionalDrivers, extraInsurance, carInGarage, rentalNumber) {
  let price = 0;
  switch (category) {
    case "A":
      price = prices[0];
      break;
    case "B":
      price = prices[1];
      break;
    case "C":
      price = prices[2];
      break;
    case "D":
      price = prices[3];
      break;
    case "E":
      price = prices[4];
      break;
    default:
      price = prices[0];
  }
  price *= (moment(finalDate).diff(moment(initialDate), 'days') + 1);
  //km pricing
  if (parseInt(kms) < 50) {
    price *= (1 + prices[5] / 100);
  }
  else if (parseInt(kms) < 150) {
    price *= (1 + prices[6] / 100);
  }
  else {
    price *= (1 + prices[7] / 100);
  }
  //age pricing
  if (parseInt(driverAge) < 25) {
    price *= (1 + prices[8] / 100);
  }
  else if (parseInt(driverAge) >= 65) {
    price *= (1 + prices[9] / 100);
  }
  //additional drivers pricing
  if (parseInt(additionalDrivers) > 0) {
    price *= (1 + prices[10] / 100);
  }
  //extra insurance pricing
  if (extraInsurance === "true") {
    price *= (1 + prices[11] / 100);
  }
  //void garage pricing
  if (carInGarage < 10) {
    price *= (1 + prices[12] / 100);
  }
  //frequent client discount
  if (rentalNumber >= 3) {
    price *= (1 + prices[13] / 100);
  }
  return price.toFixed(2);
}