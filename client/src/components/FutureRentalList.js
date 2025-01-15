import React from 'react';
import { Redirect } from 'react-router-dom';
import { CardDeck, Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext';
import API from '../api/API';
import RentalItem from './RentalItem';

class FutureRentalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, id: 0, rentals: [] };
  }

  componentDidMount() {
    API.getFutureRentals().then((rentals) => {
      this.setState({ rentals: rentals });
    }).catch((errorObj) => {
      this.props.handleErrors(errorObj);
    });
  }

  showModal = (id) => {
    this.setState({ showModal: true, id: id });
  }

  deleteRental = (id) => {
    API.deleteRental(id).then(() => {
      API.getFutureRentals().then((rentals) => {
        this.setState({ rentals: rentals });
      }).catch((errorObj) => {
        this.props.handleErrors(errorObj);
      });
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
              <>
                <CardDeck>
                  {this.state.rentals.map((b) => <RentalItem key={b.id} showModal={this.showModal} rental={b} />)}
                </CardDeck>
                <Modal show={this.state.showModal} animation={false} onHide={() => this.setState({ showModal: false })}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete rental</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>No</Button>
                    <Button variant="dark" onClick={() => {
                      this.setState({ showModal: false });
                      this.deleteRental(this.state.id);
                    }}>Yes</Button>
                  </Modal.Footer>
                </Modal>
              </>}
            {!context.authUser && <Redirect to="/" />}
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default FutureRentalList;