import React from 'react';
import { ListGroup } from 'react-bootstrap';
import FilterItem from './FilterItem';

class FilterList extends React.Component {
  render() {
    return (
      <ListGroup variant="flush">
        {this.props.filters.map((f) => <FilterItem key={f} filter={f} onFilter={this.props.onFilter} actives={this.props.actives} filterPath={this.props.filterPath} />)}
      </ListGroup>
    );
  }
}

export default FilterList;
