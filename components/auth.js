import Login from './login';
import Register from './register';

export default class Auth extends React.Component {
  state = {
    isLoggingIn: true
  };
  render() {
    return this.state.isLoggingIn ? (
      <Login
        {...this.props}
        onClick={() => this.setState({ isLoggingIn: false })}
      />
    ) : (
      <Register
        {...this.props}
        onClick={() => this.setState({ isLoggingIn: true })}
      />
    );
  }
}
