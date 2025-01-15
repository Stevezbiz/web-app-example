'use strict'

const express = require('express');
const userDao = require('./user_dao');
const carDao = require('./car_dao');
const rentalDao = require('./rental_dao');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const PORT = 3001;
const expireTime = 600;
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

//AuthN
app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userDao.getUser(username).then((user) => {
    if (user === undefined) {
      //Mail wrong
      res.status(404).send({
        errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }]
      });
    } else {
      if (!userDao.checkPassword(user, password)) {
        //Password wrong
        res.status(401).send({
          errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]
        });
      } else {
        //Success
        const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, { expiresIn: expireTime });
        res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
        res.json({ id: user.id, name: user.name });
      }
    }
  }).catch((err) => {
    new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj));
  });
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
  res.clearCookie('token').end();
});
//GET /cars
app.get('/api/cars', (req, res) => {
  carDao.getCars().then((cars) => {
    res.json(cars);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});
//GET /cars/categories
app.get('/api/cars/categories', (req, res) => {
  carDao.getCategories().then((categories) => {
    res.json(categories);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});
//GET /cars/brands
app.get('/api/cars/brands', (req, res) => {
  carDao.getBrands().then((brands) => {
    res.json(brands);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});

app.use(
  jwt({
    secret: jwtSecret,
    getToken: req => req.cookies.token
  })
);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(authErrorObj);
  }
});
//GET /pastrentals
app.get('/api/pastrentals', (req, res) => {
  const user = req.user && req.user.user;
  rentalDao.getPastRentals(user).then((rentals) => {
    res.json(rentals);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});
//GET /futurerentals
app.get('/api/futurerentals', (req, res) => {
  const user = req.user && req.user.user;
  rentalDao.getFutureRentals(user).then((rentals) => {
    res.json(rentals);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});
//POST rentals
app.post('/api/rentals', (req, res) => {
  const rental = req.body;
  if (!rental) {
    res.status(400).end();
  } else {
    const user = req.user && req.user.user;
    rental.userId = user;
    rentalDao.addRental(rental)
      .then((id) => res.status(201).json({ "id": id }))
      .catch((err) => {
        res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
      });
  }
});
//DELETE rentals/<id>
app.delete('/api/rentals/:id', (req, res) => {
  const id = req.params.id;
  rentalDao.deleteRental(id)
    .then((result) => res.status(204).end())
    .catch((err) => res.status(500).json({
      errors: [{ 'param': 'Server', 'msg': err }],
    }));
});
//GET /user
app.get('/api/user', (req, res) => {
  const user = req.user && req.user.user;
  userDao.getUserById(user).then((user) => {
    res.json({ id: user.id, name: user.name });
  }).catch((err) => {
    res.status(401).json(authErrorObj);
  });
});
//POST /payment
app.post('/api/payment', (req, res) => {
  const payment = req.body;
  if (!payment)
    res.status(400).end();
  else
    res.status(201).end();
});
//GET /carnumberandplate
app.get('/api/carnumberandplate', (req, res) => {
  const user = req.user && req.user.user;
  const category = req.query.category;
  const initialDate = req.query.initialDate;
  const finalDate = req.query.finalDate;
  carDao.getCarNumberAndPlate(user, category, initialDate, finalDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});
//GET /price
app.get('/api/price', (req, res) => {
  const user = req.user && req.user.user;
  const category = req.query.category;
  const initialDate = req.query.initialDate;
  const finalDate = req.query.finalDate;
  const driverAge = req.query.driverAge;
  const additionalDrivers = req.query.additionalDrivers;
  const kms = req.query.kms;
  const extraInsurance=req.query.extraInsurance;
  carDao.getPrice(user, category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance).then((price) => {
    res.json(price);
  }).catch((err) => {
    res.status(500).json({
      errors: [{ 'msg': err }],
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));