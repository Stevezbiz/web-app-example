import React from 'react';
import { ReactComponent as CarLogo } from './car.svg';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext'

class Header extends React.Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (

          <Navbar bg="dark" variant="dark" sticky="top">

            <Nav.Link as={NavLink} to="/">
              <Navbar.Brand>
                <CarLogo width="30" height="30" />
              </Navbar.Brand>
              <Navbar.Brand>
                Home
            </Navbar.Brand>
            </Nav.Link>

            <Nav className="mr-auto">
              {!context.authUser && <Nav.Link as={NavLink} to="/login">Rent a car</Nav.Link>}
              {context.authUser &&
                <>
                  <Nav.Link as={NavLink} to="/cars">Rent a car</Nav.Link>
                  <Nav.Link as={NavLink} to="/past_rentals">Past rentals</Nav.Link>
                  <Nav.Link as={NavLink} to="/future_rentals">Future rentals</Nav.Link>
                </>}
            </Nav>

            <Nav className="ml-md-auto">
              {context.authUser &&
                <>
                  <Navbar.Brand>Welcome {context.authUser.name}!</Navbar.Brand>
                  <Nav.Link onClick={() => { context.logoutUser() }}>Logout</Nav.Link>
                </>}
              {!context.authUser && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
            </Nav>
          </Navbar>
        )}
      </AuthContext.Consumer>
    );
  }
}


export default Header;
