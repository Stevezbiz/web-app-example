class Rental {
  constructor(id, initialDate, finalDate, category, driverAge, additionalDrivers, extraInsurance, kms, userId, plate) {
    this.id = id;
    this.initialDate = initialDate;
    this.finalDate = finalDate;
    this.category = category;
    this.driverAge = driverAge;
    this.additionalDrivers = additionalDrivers;
    this.extraInsurance = extraInsurance;
    this.kms = kms;
    this.userId = userId;
    this.plate = plate;
  }
}

export default Rental;