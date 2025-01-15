import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Container, Col, Row, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext'

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', submitted: false };
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event, onLogin) => {
    event.preventDefault();
    onLogin(this.state.username, this.state.password);
    this.setState({ submitted: true });
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            {!context.authUser &&
              <Container fluid>
                <Row>
                  <Col>
                    <h2 className="ui teal image header">
                      <div className="content">
                        Log-in to your account
                    </div>
                    </h2>

                    <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                      <Form.Group controlId="username">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email" name="email" placeholder="E-mail" value={this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus />
                      </Form.Group>

                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={(ev) => this.onChangePassword(ev)} required />
                      </Form.Group>

                      <Button variant="dark" type="submit">Login</Button>

                    </Form>

                    {context.authErr &&
                      <Alert variant="danger">
                        {context.authErr.msg}
                      </Alert>}
                  </Col>
                </Row>
              </Container>}
            {context.authUser && <Redirect to="/" />}
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default LoginForm;