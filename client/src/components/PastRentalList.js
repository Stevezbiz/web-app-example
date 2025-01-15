import React from 'react';
import { Redirect } from 'react-router-dom';
import { CardDeck } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import API from '../api/API';
import RentalItem from './RentalItem';

class PastRentalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rentals: [] };
  }

  componentDidMount() {
    API.getPastRentals().then((rentals) => {
      this.setState({ rentals: rentals });
    }).catch((errorObj) => {
      this.props.handleErrors(errorObj);
    });
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {context.authUser &&
              <CardDeck>
                {this.state.rentals.map((r) => <RentalItem key={r.id} rental={r} />)}
              </CardDeck>}
            {!context.authUser && <Redirect to="/" />}
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default PastRentalList;