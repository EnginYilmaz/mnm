import React, { Component } from 'react';
import { Picker, ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert, Platform, Text, Image, AsyncStorage, View, StyleSheet } from 'react-native';
import Listtherapist from './Listtherapist.js';
import ShowProfile from './ShowProfile.js';
import ShowPortfolio from './ShowPortfolio.js';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Button, Input, Card, CardDikey } from '../common';
import I18n from 'ex-react-native-i18n';

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

class Listscreen extends Component {
  state = {
    lat: null,
    lng: null,
    adsoyad: I18n.t('i18n_therapist_name_placeholder'),
    email: null,
    selfEmail: null,
    distance: '2',
  }
  constructor(props) {
    super(props);
    //this.AppContainer.alarm();
    //console.log(this.value);
  }

  _getLocationAsync = async () => {
    //Alert.alert("gget location async")
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //Alert.alert(status)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      //Alert.alert("tanımlı")
      //this.query_map_user_callBackMethod();
    } //Alert.alert("tanımlı değil");
    //Alert.alert("locationobject" +location)
    let location = await Location.getCurrentPositionAsync({});
    if (location.coords.latitude != "" && location.coords.longitude != "") {
      //console.log(location.coords.latitude)
      this.setState({
        lat: (location.coords.latitude).toString(),
        lng: (location.coords.longitude).toString(),
      });
    }
  };
  async componentDidMount() {
    this._mounted = true;
  }

  componentWillMount() {
    this.props.navigation.setParams({ drawerLabelText: 'deneme' });
    this._getLocationAsync();
    AsyncStorage.getItem('@massage:myemail')
      .then((email) => {
        this.setState({
          selfEmail: email,
        });
      });


    AsyncStorage.getItem('@massage:latitude')
      .then((latitude) => {
        this.setState({
          lat: latitude,
        });
        //Alert.alert(latitude)
      });
    AsyncStorage.getItem('@massage:longitude')
      .then((longitude) => {
        this.setState({
          lng: longitude,
        });
      });
  }
  componentWillUnmount() {
    this._mounted = false
  }
  onQueryMapResponse(responseJson) {
    //Alert.alert("ddddd" + responseJson.latitude);
    if (responseJson) {
      if (this._mounted) {
        this.setState({
          adsoyad: responseJson.adsoyad,
          email: responseJson.email,
          uid: responseJson.uid,
        });
      }
    }
  }
  query_map_user_with_email() {
    //Alert.alert(this.state.email)
    myURL = 'https://www.masseusenearme.com:443/query_map_user_with_email.php' + '?email=' + this.state.selfEmail;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onQueryMapResponse(request.response);
      } else {
        //console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  };

  callBackMethod = (index) => {
    //Alert.alert("burası çalıştı")
    myURL = 'https://www.masseusenearme.com:443/query_map_user.php' + '?uid=' + index;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onQueryMapResponse(request.response);
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
          <CardDikey style={{ height: '40%' }}>
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
          <ScrollView style={{ height: '60%' }}>
            <View style={{ flex: 1 }}>
              <Listtherapist latitude={this.state.lat} distance={this.state.distance} longitude={this.state.lng} callbackMethod={this.callBackMethod} />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <Text>{I18n.t('i18n_loading')}</Text>
      );
    }
  }
}
export default Listscreen;
