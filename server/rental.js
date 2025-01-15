class Rental {
  constructor(id, initialDate, finalDate, category, driverAge, additionalDrivers, extraInsurance, kms, userId, plate) {
    if (id)
      this.id = id;
    this.initialDate = initialDate;
    this.finalDate = finalDate;
    this.category = category;
    this.driverAge = driverAge;
    this.additionalDrivers = additionalDrivers;
    if (extraInsurance === 0)
      this.extraInsurance = false;
    else
      this.extraInsurance = true;
    this.kms = kms;
    this.userId = userId;
    this.plate = plate;
  }
}

module.exports = Rental;