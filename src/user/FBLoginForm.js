import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Button, Card, CardDikey, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';

class LoginForm extends Component {
  state = { email: '', password: '', error: '', loading: false };

  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
 
    }
  }

  async getOturum(key) {
    return (await AsyncStorage.getItem(key));
  }

  onUserValidateResponse(responseJson) {
    if (this._mounted) {
      this.setState({ error: responseJson.basari, loading: false });
    }
    if (responseJson.basari == true) {
      this.saveOturum('@massage:password', 'basarili');
      this.saveOturum('@massage:myemail', email);
      this.saveOturum('@massage:password', fbtoken);

      if (this._mounted) {
        //Actions.mapscreen();
        //Alert.alert(this.getOturum('@massage:myemail'))
        this.props.navigation.navigate('mapscreen', { selfEmail: email });
      }
    } else {
      if (this._mounted) {
        this.setState({ error: responseJson.basari });
      }
    }
  }
  onButtonPress = () => {
    //Alert.alert(this.state.email)
    const { email, password } = this.state;
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    let myURL = 'https://www.masseusenearme.com:443/user_validate.php' + '?email=' + email + '&password=' + password;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onUserValidateResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  componentDidMount() {
    this._mounted = true;
    const email = this.getOturum('@massage:myemail');
    const password = this.getOturum('@massage:fbtoken');
    this.setState({ email: email, password: password })
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  onLoginFail() {
    if (this._mounted) {
      this.setState({ error: 'Oturum açma başarısız', loading: false });
    }
  }

  onLoginSuccess() {
    if (this._mounted) {
      this.setState({
        email: '',
        password: '',
        loading: false,
        error: ''
      });
    }
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        {I18n.t('i18n_login')}
      </Button>
    );
  }

  render() {
    return (
      <Card>
        <CardDikey>
          {this.renderButton()}
        </CardDikey>
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};

export default LoginForm;