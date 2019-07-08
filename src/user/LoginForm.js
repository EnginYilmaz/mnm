import React, { Component } from 'react';
import { View, ScrollView, Text, AsyncStorage } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import NavigationService from '../../NavigationService.js';

class LoginForm extends Component {
  state = { email: '', password: '', error: '', loading: false, token: '', login_aktif: false };
  constructor(props) {
    super(props);
    this.registerForPushNotificationsAsync();
  }
  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }

  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  }
  async getKey(key) {
    try {
      AsyncStorage.getItem(key, (err, item) => {

        if (item) {
          this.setState({
            selfEmail: item,
          });
        }
      });
      //console.log("self email=" + this.state.selfEmail)
    } catch (error) {
      //console.log("Error retrieving data" + error);
    }
  }
  validate = (email) => {
    //console.log(email.email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email.email) === false) {
      //console.log("Email is Not Correct");
      this.setState({ email: email.email, login_aktif: false })
      return false;
    }
    else {
      this.setState({ email: email.email, login_aktif: true })
      //console.log("Email is Correct");
    }
  }
  onLoginPressResponse(responseJson) {
    //Alert.alert("terapist"+this.state.email);

    if (this._mounted) {
      this.setState({ error: responseJson.basari, loading: false });
    }
    if (responseJson.basari == true) {
      this.saveOturum('@massage:oturum', 'basarili');
      this.saveOturum('@massage:myemail', this.state.email);

      if (responseJson.rol == "terapist") {
        NavigationService.navigate('App_therapist');
      } else if (responseJson.rol == "musteri") {
        NavigationService.navigate('App_patient');
      }
      if (this._mounted) {
        this.props.navigation.navigate('mapscreen', { selfEmail: this.state.email });
      }
    } else {
      if (this._mounted) {
        this.setState({ error: responseJson.basari });
      }
    }
  }
  onLoginPress = () => {
    if (this._mounted) {
      this.setState({ error: '', loading: true });
    }
    let myURL = 'https://www.masseusenearme.com:443/user_validate.php' + '?email=' + this.state.email + '&password=' + this.state.password + '&token=' + this.state.token;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onLoginPressResponse(request.response);
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

    var buttonrender;

    if (this.state.login_aktif == true) {
      buttonrender = (
        <Button onPress={this.onLoginPress.bind(this)}>
          {I18n.t('i18n_login')}
        </Button>
      );
    } else {
      buttonrender = (
        <Button>
          {I18n.t('i18n_login')}
        </Button>
      );
    }
    return buttonrender;
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
                onChangeText={email => this.validate({ email })}
                autoCapitalize='none'
              />
            </CardDikey>
            <CardDikey>
              <Input
                style={{ textTransform: 'lowercase' }}
                secureTextEntry
                placeholder={I18n.t('i18n_password')}
                label={I18n.t('i18n_password')}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                autoCapitalize='none'
              />
            </CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
            <CardDikey>
              {this.renderButton()}
            </CardDikey>
            <CardDikey>
              <Button onPress={() => this.props.navigation.navigate('forgetpassword')}>
                {I18n.t('i18n_forgetpassword')}
              </Button>
            </CardDikey>
            <CardDikey>
              <Button onPress={() => this.props.navigation.navigate('register')}>
                {I18n.t('i18n_register')}
              </Button>
            </CardDikey>
            {/* 
            <CardDikey>
              <Button onPress={() => this.props.navigation.navigate('fbregister')}>
                {I18n.t('i18n_login_fb')}
              </Button>
            </CardDikey>
             */}
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

export default LoginForm;
