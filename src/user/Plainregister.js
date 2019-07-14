import React, { Component } from 'react';
import { Text, Platform, Image, AsyncStorage, View } from 'react-native';
import RegisterForm from './RegisterForm.js';
import I18n from 'ex-react-native-i18n';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import Constants from 'expo-constants';
import { Button, Input } from '../common';

export default class Plainregister extends Component {
  constructor(props) {
    super(props);  
  }
  
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  onPressAddressResponse(responseJson) {
    if (responseJson) {
      this.setState({
        latitude: responseJson.results[0].geometry.location.lat,
        longitude: responseJson.results[0].geometry.location.lng,
      });
      //this.saveOturum('@massage:latitude', responseJson.results[0].geometry.location.lat);
      //this.saveOturum('@massage:longitude', responseJson.results[0].geometry.location.lng);
    }
  }
  
  onPressAddress() {
    let myURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.address + '&key=AIzaSyCk8PGxIOYtUr0aQ8fErOSXRUYcPF9_XrU';
    ////console.log(myURL)
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onPressAddressResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  async saveOturum(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      ////////console.log("Error saving data" + error);
    }
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });

  };

  render() {
    if (this.state.latitude && this.state.longitude) {
      return <RegisterForm latitude={this.state.latitude} longitude={this.state.longitude} />;
    } else {
      return (
        <View style={{ height: '30%', width: '100%' }}>
          <Text>{I18n.t('i18n_cannot_detect_your_address')}</Text>
          <Input
            placeholder={I18n.t('i18n_your_address')}
            label={I18n.t('i18n_your_address')}
            value={this.state.address}
            onChangeText={address => this.setState({ address })}
            autoCapitalize = 'none'
          />
          <Button onPress={this.onPressAddress.bind(this)}>
            {I18n.t('i18n_find_my_address')}
          </Button>
        </View>
      );
    }
  }
}
