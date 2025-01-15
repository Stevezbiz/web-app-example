import React from 'react';

class CarItem extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.car.brand}</td>
        <td>{this.props.car.model}</td>
        <td>{this.props.car.category}</td>
      </tr>
    );
  }
}

export default CarItem;