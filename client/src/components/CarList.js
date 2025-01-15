import React from 'react';
import { Table } from 'react-bootstrap';
import CarItem from './CarItem';

class CarList extends React.Component {
  render() {
    return (
      <Table striped bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            <th scope="col">Brand</th>
            <th scope="col">Model</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {this.props.cars.map((car) => <CarItem key={car.plate} car={car} />)}
        </tbody>
      </Table>
    );
  }
}

export default CarList;