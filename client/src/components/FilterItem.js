import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

class FilterItem extends React.Component {
  render() {
    return (
      <ListGroup.Item action variant="dark" active={this.props.actives.has(this.props.filter)} onClick={() => this.props.onFilter(this.props.filter)}>{this.props.filter}</ListGroup.Item>
    );
  }
}

export default FilterItem;