import './App.css';
import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import { Switch } from 'react-router';
import API from './api/API';
import { AuthContext } from './auth/AuthContext';
import { Row, Col, Container } from 'react-bootstrap';
import CarList from './components/CarList';
import Configurator from './components/Configurator';
import FilterList from './components/FilterList';
import FutureRentalList from './components/FutureRentalList';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import PastRentalList from './components/PastRentalList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [], categories: [], brands: [],
      activeCategories: new Set(), activeBrands: new Set(),
      filteredCars: []
    };
  }

  componentDidMount() {
    this.getCars();
    API.isAuthenticated().then((user) => {
      this.setState({ authUser: user, authErr: null });
    }).catch((err) => {
      this.setState({ authErr: err.errorObj });
    });
  }

  handleErrors = (err) => {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authUser: null, authErr: err.errorObj });
        this.props.history.push("/login");
      }
    }
  }

  logout = () => {
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null, rentals: [] });
      this.props.history.push("/cars");
    });
  }

  login = (username, password) => {
    API.userLogin(username, password).then((user) => {
      this.setState({ authUser: user, authErr: null });
      this.props.history.push("/cars");
    }).catch((errorObj) => {
      const err0 = errorObj.errors[0];
      this.setState({ authErr: err0 });
    });
  }

  getCars = () => {
    API.getCars().then((cars) => {
      API.getCategories().then((categories) => {
        API.getBrands().then((brands) => {
          this.setState({ cars: cars, brands: brands, categories: categories, filteredCars: cars });
        }).catch((errorObj) => {
          this.handleErrors(errorObj);
        });
      }).catch((errorObj) => {
        this.handleErrors(errorObj);
      });
    }).catch((errorObj) => {
      this.handleErrors(errorObj);
    });
  }

  filterByBrand = (filter) => {
    const activeBrands = new Set(this.state.activeBrands);
    if (!activeBrands.delete(filter)) {
      activeBrands.add(filter);
    }
    this.filterCars(activeBrands, this.state.activeCategories);
  }

  filterByCategory = (filter) => {
    const activeCategories = new Set(this.state.activeCategories);
    if (!activeCategories.delete(filter)) {
      activeCategories.add(filter);
    }
    this.filterCars(this.state.activeBrands, activeCategories);
  }

  filterCars = (brandFilters, categoryFilters) => {
    const cars = this.state.cars.slice();
    let filteredCars = [];
    let ok = false;
    if (brandFilters.size === 0 && categoryFilters.size === 0) {
      filteredCars = this.state.cars.slice();
    }
    else if (brandFilters.size === 0) {
      for (const c of cars) {
        for (const f of categoryFilters) {
          if (c.category === f) {
            filteredCars.push(c);
            break;
          }
        }
      }
    }
    else if (categoryFilters.size === 0) {
      for (const c of cars) {
        for (const f of brandFilters) {
          if (c.brand === f) {
            filteredCars.push(c);
            break;
          }
        }
      }
    }
    else {
      for (const c of cars) {
        for (const f of brandFilters) {
          if (c.brand === f) {
            ok = true;
            break;
          }
        }
        if (ok) {
          for (const f of categoryFilters) {
            if (c.category === f) {
              filteredCars.push(c);
              break;
            }
          }
          ok = false;
        }
      }
    }
    this.setState({ filteredCars: filteredCars, activeBrands: brandFilters, activeCategories: categoryFilters });
  }

  render() {
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout
    }
    return (
      <AuthContext.Provider value={value}>

        <Header />

        <Container fluid>

          <Switch>
            <Route path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <LoginForm />
                </Col>
              </Row>
            </Route>

            <Route path='/past_rentals'>
              <Row className="vheight-100">
                <Col className="below-nav">
                  <h1>Past rentals</h1>
                  <PastRentalList handleErrors={this.handleErrors} />
                </Col>
              </Row>
            </Route>

            <Route path='/future_rentals'>
              <Row className="vheight-100">
                <Col className="below-nav">
                  <h1>Future rentals</h1>
                  <FutureRentalList handleErrors={this.handleErrors} deleteRental={this.deleteRental} />
                </Col>
              </Row>
            </Route>

            <Route path="/cars">
              <AuthContext.Consumer>
                {(context) => (
                  <Row className="vheight-100">
                    {!context.authUser &&
                      <>
                        <Col sm={2} bg="light" id="left-sidebar-brand">
                          <FilterList filters={this.state.brands} onFilter={this.filterByBrand} actives={this.state.activeBrands} />
                        </Col>
                        <Col sm={1} bg="light" id="left-sidebar-category">
                          <FilterList filters={this.state.categories} onFilter={this.filterByCategory} actives={this.state.activeCategories} />
                        </Col>
                        <Col sm={8} className="below-nav">
                          <h1><strong>Cars</strong></h1>
                          <CarList cars={this.state.filteredCars} />
                        </Col>
                      </>}
                    {context.authUser &&
                      <>
                        <Col sm={3}></Col>
                        <Col sm={6} className="below-nav">
                          <Configurator handleErrors={this.handleErrors} categories={this.state.categories} />
                        </Col>
                      </>}
                  </Row>
                )}
              </AuthContext.Consumer>
            </Route>

            <Route>
              <Redirect to='/cars' />
            </Route>
          </Switch>
        </Container>
      </AuthContext.Provider >
    );
  }
}

export default withRouter(App);
