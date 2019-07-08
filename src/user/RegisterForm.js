import React, { Component } from 'react';
import { ScrollView, Image, AsyncStorage, Text, Switch } from 'react-native';
import { Button, Card, CardDikey, Input, Spinner } from '../common';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import I18n from 'ex-react-native-i18n';


class RegisterForm extends Component {
  async componentDidMount() {
    this._mounted = true;
  }
  state = { adsoyad: '', email: '', password: '', password_repeat: '', error: '', warning: false, rol: false, loading: false, token: '', kaydol_aktif: false };

  constructor(props) {
    super(props);
    this.registerForPushNotificationsAsync();
  }

  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return
    }
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  }

  componentWillUnmount() {
    this._mounted = false
  }
  validate = (email) => {
    //console.log(email.email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email.email) === false) {
      //console.log("Email is Not Correct");
      this.setState({ email: email.email, error: I18n.t('i18n_enter_valid_email'), kaydol_aktif: false })
      return false;
    }
    else {
      this.setState({ email: email.email, error: '', kaydol_aktif: true })
      //console.log("Email is Correct");
    }
  }
  onRegisterPressResponse(responseJson) {
    if (this._mounted) {
      this.setState({ error: responseJson.basari, loading: false });
      this.saveKey('@massage:myemail', responseJson.email);
      this.saveKey('@massage:password', responseJson.password);
      if (responseJson.basari == true) {
        this.props.navigation.navigate('mapscreen')
      } else {
        this.setState({ error: responseJson.basari });
      }
      this.setState({ warning: true });
    }
  }
  onRegisterPress() {
    if (this.state.password != this.state.password_repeat) {
      this.setState({ error: 'Passwords does not match' });
    }
    if (this.state.email) {
      this.setState({ error: '', loading: true });
      let myURL = 'https://www.masseusenearme.com:443/user_register_massage.php' + '?email=' + this.state.email + '&adsoyad=' + this.state.adsoyad + '&password=' + this.state.password + '&latitude=' + '' + this.props.latitude + '&longitude=' + this.props.longitude + '&password_repeat=' + this.state.password_repeat + '&rol=' + this.state.rol + '&token=' + this.state.token;
      //Alert.alert(this.props.latitude.toString())
      if (this.props.latitude != "" && this.props.longitude != "") {
        //Alert.alert("çalışmaması gerektiği halde çalıştı")
        this.saveKey('@massage:latitude', this.props.latitude.toString());
        this.saveKey('@massage:longitude', this.props.longitude.toString());
      }
      var request = new XMLHttpRequest();
      request.responseType = 'json';
      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          this.onRegisterPressResponse(request.response);
        } else {
          console.warn('error');
        }
      };
      request.open('GET', myURL);
      request.send();
    }
  }

  async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
    }
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }

  onLoginFail() {
    this.setState({ error: 'Authentication Failed', loading: false });
  }

  onLoginSuccess() {
    if (this._mounted) {
      this.setState({
        email: '',
        password: '',
        loading: false,
        error: '',
      });
    }
    ////Alert.alert("başarılı bir şekilde login oldu");
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }
    var buttonrender;
    if (this.state.kaydol_aktif == true) {
      buttonrender = (
        <Button onPress={this.onRegisterPress.bind(this)}>
          {I18n.t('i18n_register')}
        </Button>
      );
    } else {
      buttonrender = (
        <Button>
          {I18n.t('i18n_register')}
        </Button>
      );
    }
    return buttonrender;
  }

  render() {
    //if (this.props.location.coords.latitude) {
    //Alert.alert(this.state.token)
    if (this.props.latitude && this.props.longitude) {
      return (
        <ScrollView>
          <Card>
            <CardDikey>
              <Input
                placeholder={I18n.t('i18n_full_name')}
                label={I18n.t('i18n_full_name')}
                value={this.state.adsoyad}
                onChangeText={adsoyad => this.setState({ adsoyad })}
                autoCapitalize='words'
              />
            </CardDikey>
            <CardDikey>
              <Input
                placeholder={I18n.t('i18n_email_placeholder')}
                label={I18n.t('i18n_email')}
                value={this.state.email}
                onChangeText={email => this.validate({ email })}
                autoCapitalize='none'
              />
            </CardDikey>
            <CardDikey>
              <Input
                secureTextEntry
                placeholder={I18n.t('i18n_password')}
                label={I18n.t('i18n_password')}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                autoCapitalize='none'
              />
            </CardDikey>
            <CardDikey>
              <Input
                secureTextEntry
                placeholder={I18n.t('i18n_password')}
                label={I18n.t('i18n_password_repeat')}
                value={this.state.password_repeat}
                onChangeText={password_repeat => this.setState({ password_repeat })}
                autoCapitalize='none'
              />
            </CardDikey>
            <CardDikey>
              <CardDikey>
                <Text style={styles.rolTextStyle}>
                  {I18n.t('i18n_massage_master')}
                </Text>
              </CardDikey>
              <Switch
                onValueChange={rol => this.setState({ rol })}
                value={this.state.rol} />
            </CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
            <CardDikey>
              {this.renderButton()}
            </CardDikey>
          </Card>
          {this.state.warning ?
            <CardDikey>
              <Image style={{ width: 50, height: 50 }} source={require('../../assets/warning.png')} />
              <Text style={styles.warnTextStyle}>
                {I18n.t('i18n_email_validation')}
              </Text>
            </CardDikey> : <CardDikey><Text></Text></CardDikey>}
        </ScrollView>
      );
    } else {
      return (
        <Text>There is no coordinate please report this problem to engin@masseusenearme.com address</Text>
      );
    }
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  warnTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'yellow',
    backgroundColor: 'black',
    width: '60%',
  },
  rolTextStyle: {
    fontSize: 20,
    color: 'purple'
  }
};

export default RegisterForm;
