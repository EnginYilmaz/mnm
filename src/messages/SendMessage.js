import React, { Component } from 'react'
import { AsyncStorage, Text, View, Image } from 'react-native'
import { Spinner, Button, Card, CardDikey, Minput } from '../common';
import I18n from 'ex-react-native-i18n';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import {withNavigation} from 'react-navigation';

//pazar
//I18n.initAsync();

class SendMessage extends Component {
  static navigationOptions = {
    drawerLabel: null,
  }
  state = {
    adsoyad: null,
    eposta: null,
    loadingSendingMessage: false,
  };
  constructor(props) {
    super(props);
    //this.getNotificationState();
  }

  async getKey(key) {
    try {
      this.value = await AsyncStorage.getItem(key);
    } catch (error) {
      ////////console.log("Error retrieving data" + error);
    }
  }
  async componentDidMount() {
    this._mounted = true;
    const emailim = await AsyncStorage.getItem('@massage:myemail');
    this.setState({ eposta: emailim });
  }

  componentWillUnmount() {
    this._mounted = false
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
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    let notificationURL = 'https://www.masseusenearme.com:443/send_notification.php' + '?message=' + this.state.bodymessage + '&senderid=' + this.state.eposta + '&receipentid=' + this.props.navigation.getParam('email');
    var request = new XMLHttpRequest();
    request.responseType= 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
    };
    request.open('GET', notificationURL);
    request.send();
  }

  onMessagePressResponse(responseJson) {
    if (this._mounted) {
      this.setState({ error: responseJson.basari });
    }
    if (responseJson.basari == true) {
      if (this._mounted) {
        this.setState({ error: "Successfully sent message", loadingSendingMessage: false })
      }
    } else {
      if (this._mounted) {
        this.setState({ error: responseJson.basari })
      }
    }
  }
  onMessagePress() {
    this.registerForPushNotificationsAsync();
    this.setState({ error: '', loading: true, loadingSendingMessage: true });
    myURL = 'https://www.masseusenearme.com:443/send_message.php' + '?message=' + this.state.bodymessage + '&senderid=' + this.state.eposta + '&receipentid=' + this.props.navigation.getParam('email');
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onMessagePressResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }

  renderSMButton() {
    if (this.state.loadingSendingMessage) {
      return <Spinner size="small" />;
    } else {
      return (
        <Button onPress={this.onMessagePress.bind(this)}>
          {I18n.t('i18n_send_message')}
        </Button>
      );
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    let pic = {
      uri: 'https://www.masseusenearme.com:443/resimler/kullaniciresmi/' + this.props.navigation.getParam('email') + '.jpeg'+ '?',
    };

    ////Alert.alert(this.props.email);
    return (
      <Card>
        <View>
          <Image source={pic}
            style={{ width: 100, height: 150 }}
            defaultSource={require("../../assets/sample_therapist.png")}
          />
          <Text>{this.props.adsoyad}</Text>
          <CardDikey>
            <Minput
              label={I18n.t('i18n_message_body')}
              value={this.state.bodymessage}
              onChangeText={bodymessage => this.setState({ bodymessage })}
            />
          </CardDikey>
          <CardDikey>
            {this.renderSMButton()}
          </CardDikey>
          <CardDikey>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
          </CardDikey>
        </View>
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  rolTextStyle: {
    fontSize: 20,
    color: 'purple'
  }
};

export default withNavigation(SendMessage);

//---------------------------------------------------------------------------------------------------------






