import Car from './Car';
import Rental from './Rental';

const baseUrl = "/api";

async function isAuthenticated() {
  let url = "/user";
  const response = await fetch(baseUrl + url);
  const userJson = await response.json();
  if (response.ok) {
    return userJson;
  } else {
    let err = { status: response.status, errObj: userJson };
    throw err;
  }
}

async function userLogin(username, password) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((user) => {
          resolve(user);
        });
      } else {
        response.json().then((obj) => {
          reject(obj);
        }).catch((err) => {
          reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] });
        });
      }
    }).catch((err) => {
      reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
    });
  });
}

async function userLogout() {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/logout', {
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json().then((obj) => {
          reject(obj);
        }).catch((err) => {
          reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] });
        });
      }
    });
  });
}

async function getCars() {
  let url = "/cars";
  const response = await fetch(baseUrl + url);
  const carsJson = await response.json();
  if (response.ok) {
    return carsJson.map((c) => new Car(c.plate, c.model, c.brand, c.category));
  }
  else {
    let err = { status: response.status, errObj: carsJson };
    throw err;
  }
}

async function getCategories() {
  let url = "/cars/categories";
  const response = await fetch(baseUrl + url);
  const categoriesJson = await response.json();
  if (response.ok) {
    return categoriesJson.map((c) => c.category);
  }
  else {
    let err = { status: response.status, errObj: categoriesJson };
    throw err;
  }
}

async function getBrands() {
  let url = "/cars/brands";
  const response = await fetch(baseUrl + url);
  const brandsJson = await response.json();
  if (response.ok) {
    return brandsJson.map((b) => b.brand);
  }
  else {
    let err = { status: response.status, errObj: brandsJson };
    throw err;
  }
}

async function getPastRentals() {
  let url = "/pastrentals";
  const response = await fetch(baseUrl + url);
  const rentalsJson = await response.json();
  if (response.ok) {
    return rentalsJson.map((b) => {
      return new Rental(b.id, b.initialDate, b.finalDate,
        b.category, b.driverAge, b.additionalDrivers,
        b.extraInsurance, b.kms, b.userId, b.plate);
    });
  }
  else {
    let err = { status: response.status, errObj: rentalsJson };
    throw err;
  }
}

async function getFutureRentals() {
  let url = "/futurerentals";
  const response = await fetch(baseUrl + url);
  const rentalsJson = await response.json();
  if (response.ok) {
    return rentalsJson.map((b) => {
      return new Rental(b.id, b.initialDate, b.finalDate,
        b.category, b.driverAge, b.additionalDrivers,
        b.extraInsurance, b.kms, b.userId, b.plate);
    });
  }
  else {
    let err = { status: response.status, errObj: rentalsJson };
    throw err;
  }
}

async function addRental(rental) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + "/rentals", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rental),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json().then((obj) => {
          reject(obj);
        }).catch((err) => {
          reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] });
        });
      }
    }).catch((err) => {
      reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
    });
  });
}

async function deleteRental(id) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + "/rentals/" + id, {
      method: 'DELETE'
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json().then((obj) => {
          reject(obj);
        }).catch((err) => {
          reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] });
        });
      }
    }).catch((err) => {
      reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
    });
  });
}

async function getCarNumberAndPlate(category, initialDate, finalDate) {
  let url = "/carnumberandplate";
  const queryParams = "?category=" + category + "&initialDate=" + initialDate + "&finalDate=" + finalDate;
  url += queryParams;
  const response = await fetch(baseUrl + url);
  const carNumberAndPlateJson = await response.json();
  if (response.ok) {
    return carNumberAndPlateJson;
  }
  else {
    let err = { status: response.status, errObj: carNumberAndPlateJson };
    throw err;
  }
}

async function getPrice(category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance) {
  let url = "/price";
  const queryParams = "?category=" + category +
    "&initialDate=" + initialDate +
    "&finalDate=" + finalDate +
    "&driverAge=" + driverAge +
    "&additionalDrivers=" + additionalDrivers +
    "&kms=" + kms +
    "&extraInsurance=" + extraInsurance;
  url += queryParams;
  const response = await fetch(baseUrl + url);
  const priceJson = await response.json();
  if (response.ok) {
    return priceJson;
  }
  else {
    let err = { status: response.status, errObj: priceJson };
    throw err;
  }
}

async function pay(payment) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json().then((obj) => {
          reject(obj);
        }).catch((err) => {
          reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] });
        });
      }
    }).catch((err) => {
      reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
    });
  });
}

const API = {
  isAuthenticated,
  userLogin,
  userLogout,
  getCars,
  getCategories,
  getBrands,
  getPastRentals,
  getFutureRentals,
  addRental,
  deleteRental,
  getCarNumberAndPlate,
  getPrice,
  pay
};
export default API;