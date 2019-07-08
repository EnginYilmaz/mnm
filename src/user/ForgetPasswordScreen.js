import React, { Component } from 'react';
import { View, ScrollView, Text, AsyncStorage } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';

class ForgetPasswordScreen extends Component {
  state = { email: '', error: '', loading: false };

  onForgetPasswordResponse(responseJson) {
    if (responseJson.basari == true) {
      if (this._mounted) {
        this.props.navigation.navigate('login');
      }
    } else {
      if (this._mounted) {
        this.setState({ error: responseJson.basari });
      }
    }
  }
  onForgetPasswordPressed = () => {
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    let myURL = 'https://www.masseusenearme.com:443/forgetpassword.php' + '?email=' + this.state.email;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onForgetPasswordResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }

 renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    return (
      <Button onPress={this.onForgetPasswordPressed.bind(this)}>
        {I18n.t('i18n_forgetpassword')}
      </Button>
    );
  }

  render() {
    return (
      <View>
        <ScrollView>
          <Card>
            <CardDikey>
              <Input
                placeholder={I18n.t('i18n_email')}
                label={I18n.t('i18n_email')}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                autoCapitalize = 'none'
                />
            </CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
            <CardDikey>
              {this.renderButton()}
            </CardDikey>
          </Card>
        </ScrollView>
      </View>
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

export default ForgetPasswordScreen;
