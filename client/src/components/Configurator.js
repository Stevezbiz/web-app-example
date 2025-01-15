import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import API from '../api/API';

class Configurator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: "",
      finalDate: "",
      category: "A",
      driverAge: "40",
      additionalDrivers: "0",
      kms: "70",
      extraInsurance: false,
      name: "",
      cardNumber: "",
      cvv: "",
      submittedForm: false,
      submittedPayment: false,
      carNumber: "",
      plate: "",
      price: "Fill all the fields, please",
      paymentOk: null,
      paymentError: null
    };
  }

  getCarNumberAndPlate = (category, initialDate, finalDate) => {
    API.getCarNumberAndPlate(category, initialDate, finalDate).then((data) => {
      this.setState({ carNumber: data.carNumber, plate: data.plate });
    }).catch((errorObj) => {
      this.props.handleErrors(errorObj);
    });
  }

  getPrice = (category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance) => {
    API.getPrice(category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance).then((price) => {
      this.setState({ price: price });
    }).catch((errorObj) => {
      this.props.handleErrors(errorObj);
    });
  }

  payAndRent = (rental, payment) => {
    API.pay(payment).then(() => {
      this.setState({ paymentOk: true });
      API.addRental(rental).then().catch((errorObj) => {
        this.props.handleErrors(errorObj);
      });
    }).catch((errorObj) => {
      this.setState({ paymentError: true });
      this.props.handleErrors(errorObj);
    });
  }

  updateFieldForm = (name, value) => {
    this.setState({ [name]: value });
    switch (name) {
      case "category":
        this.calculateCarNumber(value, this.state.initialDate, this.state.finalDate);
        this.calculatePrice(value, this.state.initialDate, this.state.finalDate, this.state.driverAge, this.state.additionalDrivers, this.state.kms, this.state.extraInsurance);
        break;
      case "initialDate":
        this.calculateCarNumber(this.state.category, value, this.state.finalDate);
        this.calculatePrice(this.state.category, value, this.state.finalDate, this.state.driverAge, this.state.additionalDrivers, this.state.kms, this.state.extraInsurance);
        break;
      case "finalDate":
        this.calculateCarNumber(this.state.category, this.state.initialDate, value);
        this.calculatePrice(this.state.category, this.state.initialDate, value, this.state.driverAge, this.state.additionalDrivers, this.state.kms, this.state.extraInsurance);
        break;
      case "driverAge":
        this.calculatePrice(this.state.category, this.state.initialDate, this.state.finalDate, value, this.state.additionalDrivers, this.state.kms, this.state.extraInsurance);
        break;
      case "additionalDrivers":
        this.calculatePrice(this.state.category, this.state.initialDate, this.state.finalDate, this.state.driverAge, value, this.state.kms, this.state.extraInsurance);
        break;
      case "kms":
        this.calculatePrice(this.state.category, this.state.initialDate, this.state.finalDate, this.state.driverAge, this.state.additionalDrivers, value, this.state.extraInsurance);
        break;
      case "extraInsurance":
        this.calculatePrice(this.state.category, this.state.initialDate, this.state.finalDate, this.state.driverAge, this.state.additionalDrivers, this.state.kms, value);
        break;
      default:
        break;
    }
  }

  updateFieldPayment = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmitForm = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    }
    else if (this.state.carNumber > 0) {
      this.setState({ submittedForm: true });
    }
  }

  handleSubmitPayment = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    }
    else {
      this.payAndRent({
        initialDate: this.state.initialDate,
        finalDate: this.state.finalDate,
        category: this.state.category,
        driverAge: this.state.driverAge,
        additionalDrivers: this.state.additionalDrivers,
        extraInsurance: this.getExtraInsurance(),
        kms: this.state.kms,
        plate: this.state.plate
      }, {
        name: this.state.name,
        cardNumber: this.state.cardNumber,
        cvv: this.state.cvv
      });
      this.setState({ submittedPayment: true });
    }
  }

  calculatePrice = (category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance) => {
    if (initialDate !== "" && finalDate !== "" && category !== "" && kms !== "") {
      if (moment(initialDate).isBefore(moment()) ||
        moment(initialDate).isAfter(moment(finalDate))) {
        this.setState({ price: "Invalid date" });
      }
      else {
        this.getPrice(category, initialDate, finalDate, driverAge, additionalDrivers, kms, extraInsurance);
      }
    }
    else {
      this.setState({ price: "Fill all the fields, please" });
    }
  }

  calculateCarNumber = (category, initialDate, finalDate) => {
    if (initialDate !== "" && finalDate !== "" && category !== "") {
      if (moment(initialDate).isBefore(moment()) ||
        moment(initialDate).isAfter(moment(finalDate))) {
        this.setState({ carNumber: "Invalid Date", plate: "" });
      }
      else {
        this.getCarNumberAndPlate(category, initialDate, finalDate);
      }
    }
    else {
      this.setState({ carNumber: "", plate: "" });
    }
  }

  getExtraInsurance = () => {
    if (this.state.extraInsurance)
      return 1;
    return 0;
  }

  render() {
    if (this.state.submittedForm)
      return (
        <>
          <h1>Payment</h1>
          <Form method="POST" onSubmit={(event) => this.handleSubmitPayment(event)}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Complete name</Form.Label>
                <Form.Control name="name" value={this.state.name} required autoFocus onChange={(ev) => this.updateFieldPayment(ev.target.name, ev.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Col sm={9}>
                <Form.Group >
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control name="cardNumber" minLength={16} maxLength={16} pattern="[0-9]*" value={this.state.cardNumber} required autoFocus onChange={(ev) => this.updateFieldPayment(ev.target.name, ev.target.value)} />
                </Form.Group>
              </Col>
              <Col sm={1} />
              <Col sm={2}>
                <Form.Group>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control name="cvv" minLength={3} maxLength={5} pattern="[0-9]*" value={this.state.cvv} required autoFocus onChange={(ev) => this.updateFieldPayment(ev.target.name, ev.target.value)} />
                </Form.Group>
              </Col>
              <Form.Group as={Col}>
                <Form.Label>Amount:</Form.Label>
                <h5><Form.Label>{this.state.price}</Form.Label></h5>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Button variant="dark" type="submit">Pay</Button>
              </Form.Group>
              <Form.Group as={Col}>
                <Button variant="secondary" onClick={() => this.setState({ submittedForm: false, cvv: "", cardNumber: "", name: "" })}>Cancel</Button>
              </Form.Group>
            </Form.Row>
          </Form>
          <Modal backdrop="static" show={this.state.paymentOk} keyboard={false} animation={false} centered>
            <Modal.Header>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Link to="/future_rentals"><Button variant="dark">Ok</Button></Link>
            </Modal.Footer>
          </Modal>
          <Modal backdrop="static" show={this.state.paymentError} keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Link to="/"><Button variant="dark">Ok</Button></Link>
            </Modal.Footer>
          </Modal>
        </>
      );
    return (
      <>
        <h1>Rent a car</h1>
        <Form method="POST" onSubmit={(event) => this.handleSubmitForm(event)}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>From</Form.Label>
              <Form.Control type="date" name="initialDate" value={this.state.initialDate} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>To</Form.Label>
              <Form.Control type="date" name="finalDate" value={this.state.finalDate} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" name="category" value={this.state.category} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)}>
                {this.props.categories.map((c) => <option key={c}>{c}</option>)}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Driver age</Form.Label>
              <Form.Control type="number" name="driverAge" min="18" max="120" value={this.state.driverAge} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Additional drivers</Form.Label>
              <Form.Control type="number" name="additionalDrivers" min="0" value={this.state.additionalDrivers} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Estimated distance (Kms/day)</Form.Label>
              <Form.Control type="number" name="kms" min="10" max="1000" step="10" value={this.state.kms} required autoFocus onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.value)} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} sm={4}>
              <Form.Check type="checkbox" label="Extra insurance" name="extraInsurance" checked={this.state.extraInsurance} onChange={(ev) => this.updateFieldForm(ev.target.name, ev.target.checked)} />
            </Form.Group>
          </Form.Row>
          <hr className="solid" />
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Available cars: </Form.Label>
              <h5><Form.Label name="carNumber">{this.state.carNumber}</Form.Label></h5>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Total price: </Form.Label>
              <h5><Form.Label name="price">{this.state.price}</Form.Label></h5>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Button variant="dark" type="submit">Rent</Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </>
    );
  }
}

export default Configurator;
