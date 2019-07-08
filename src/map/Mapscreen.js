import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert, Platform, Text, Image, AsyncStorage, View, StyleSheet } from 'react-native';
import Fetchdata from './Fetchdata.js';
import ShowProfile from './ShowProfile.js';
import ShowPortfolio from './ShowPortfolio.js';
//import { createStackNavigator, createDrawerNavigator, NavigationActions, DrawerItems, SafeAreaView } from 'react-navigation'; // Version can be specified in package.json
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import I18n from 'ex-react-native-i18n';
import { Card, CardDikey } from '../common';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    height: '30%',
    width: '95%',
    flex: 1,
  },
  profile: {
    height: '20%',
    width: '100%',
    flex: 1,
    flexDirection: 'column'
  },
  tub: {
    height: 300,
    width: 400,
    flex: 1,
  },
});

class Mapscreen extends Component {
  state = {
    lat: null,
    lng: null,
    adsoyad: null,
    email: null,
    selfEmail: null,
  }

  constructor(props) {
    super(props);
    //this.AppContainer.alarm();

  }
  _getLocationAsync = async () => {
    ///React.Component.App.alarm();

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    //  this.setState({ location });
    ////Alert.alert(location.coords.latitude+ " ");
    this.setState({
      lat: parseFloat(location.coords.latitude),
      lng: parseFloat(location.coords.longitude)
    });

  };

  async componentDidMount() {
    this._mounted = true;
  }
  componentWillMount() {
    this.props.navigation.setParams({ drawerLabelText: 'deneme' });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    AsyncStorage.getItem('@massage:myemail')
      .then((email) => {
        this.setState({
          selfEmail: email,
        });
        ////Alert.alert(email)
      });
  }
  componentWillUnmount() {
    this._mounted = false
  }

  onQueryMapUserResponse(responseJson) {
    if (this._mounted) {
      this.setState({
        adsoyad: responseJson.adsoyad,
        email: responseJson.email,
        uid: responseJson.uid
      });
    }
  }

  callbackMethod = (index) => {
    let myURL = 'https://www.masseusenearme.com:443/query_map_user.php' + '?uid=' + index;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onQueryMapUserResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  };

  render() {
    if (this.state.lat && this.state.lng) {
      return (
        <View>
          <Card>
            <Card>
              <CardDikey>
                <Fetchdata key={this.state.uid} latitude={this.state.lat} longitude={this.state.lng} callbackMethod={this.callbackMethod} />
              </CardDikey>
            </Card>
            <Card>
              <CardDikey>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('fullportfolio', { therapist_email: this.state.email, patient_email: this.state.selfEmail })}>
                  <ShowProfile
                    propsnav={this.props.navigation}
                    style={styles.profile}
                    adsoyad={this.state.adsoyad}
                    email={this.state.email}
                  />
                  <ShowPortfolio key={this.state.uid} style={styles.tub} email={this.state.email} limit='3' />
                </TouchableOpacity>
              </CardDikey>
            </Card>
          </Card>
        </View>
      );
    } else {
      return (
        <Card>
          <CardDikey>
            <Fetchdata style={styles.map} latitude={this.state.lat} longitude={this.state.lng} callbackMethod={this.callbackMethod} />
            <ShowProfile propsnav={this.props.navigation} style={styles.profile} adsoyad={this.state.adsoyad} email={this.state.email} />
            <Text>{I18n.t('i18n_nomassage_on_the_maps')}</Text>
          </CardDikey>
        </Card>
      );
    }
  }
}
export default Mapscreen;
