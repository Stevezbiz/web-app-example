import React from 'react';
import moment from 'moment';
import { Card, Button } from 'react-bootstrap';

class RentalItem extends React.Component {
  rentalState = () => {
    if (moment(this.props.rental.initialDate).isAfter(moment(), 'day'))
      return "Rented";
    if (!moment(this.props.rental.finalDate).isBefore(moment(), 'day'))
      return "Active";
    return "Expired";
  }

  render() {
    return (
      <Card bg={this.rentalState() === "Active" ? "success" : "dark"} text="white" style={{ "minWidth": "20rem", "maxWidth": "20rem", "marginBottom": "15px", "marginTop": "15px" }}>
        <Card.Header>{this.rentalState()}</Card.Header>
        <Card.Body>
          <Card.Text>From: {this.props.rental.initialDate}</Card.Text>
          <Card.Text>To: {this.props.rental.finalDate}</Card.Text>
          <Card.Text>Category: {this.props.rental.category}</Card.Text>
          <Card.Text>Driver's age: {this.props.rental.driverAge}</Card.Text>
          <Card.Text>Additional drivers: {this.props.rental.additionalDrivers}</Card.Text>
          <Card.Text>Kms/day: {this.props.rental.kms}</Card.Text>
          <Card.Text>Extra insurance: {this.props.rental.extraInsurance ? "yes" : "no"}</Card.Text>
          {this.rentalState() === "Rented" ? <Button variant="danger" onClick={() => this.props.showModal(this.props.rental.id)}>Delete</Button> : <></>}
        </Card.Body>
      </Card>
    );
  }
}

export default RentalItem;