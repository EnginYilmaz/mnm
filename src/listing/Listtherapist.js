import React, { Component } from 'react'
import { Picker, ScrollView, AsyncStorage, Text, View, StyleSheet, Switch, Alert, StatusBar } from 'react-native'
import { Spinner, Button, ListButton, Card, CardYatay } from '../common';
import I18n from 'ex-react-native-i18n';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    height: 400,
    width: 400,
  },
});

export default class Listtherapist extends Component {
  constructor(props) {
    super(props);

    this.lookupNearbyTherapists(this.props.latitude, this.props.longitude, this.props.distance);
  };
  state = {
    basari: false,
    listeler: [],
    ltd: this.props.latitude,
    lng: this.props.longitude,
  };

  async getKey(key) {
    if (this._mounted) {
      try {
        this.value = await AsyncStorage.getItem(key);
      } catch (error) {
        //////console.log("Error retrieving data" + error);
      }
    }
  }
  onLookupNearbyTherapistsResponse(responseJson) {
    if (responseJson) {
      if (this._mounted) {
        this.setState({ listeler: responseJson });
      }
    }
  }
  lookupNearbyTherapists(ltd, lng, distance) {
    if (ltd == null) {
      ltd = this.state.ltd;
      lng = this.state.lng;
    }
    console.log(ltd+" " + lng + " " + distance);
    let myURL = 'https://www.masseusenearme.com:443/query_maps.php' + '?latitude=' + ltd + '&longitude=' + lng + '&distance=' + distance
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onLookupNearbyTherapistsResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  async saveKey(key, value) {
    if (this._mounted) {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        //////console.log("Error saving data" + error);
      }
    }
  }

  onUserValidateResponse(responseJson) {
    if (this._mounted) {
      this.setState({ basari: responseJson });
    }
  }
  componentDidMount = () => {
    this._mounted = true;
    myURL= 'https://www.masseusenearme.com:443/user_validate.php' + '?email=' + this.getKey('@massage:myemail') + '&password=' + this.getKey('@massage:password');
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

  onPressList(index) {
    this.props.callbackMethod(index);
  }

  render() {
    //Alert.alert("latitude="+this.props.latitude)
    if (this.props.latitude && this.props.longitude) {
      return (
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%' }}>
            <Text>{I18n.t('i18n_therapist_distance')}</Text>
            <Picker
              selectedValue={this.state.itemValue}
              style={{ height: 50, width: 200 }}
              onValueChange={(itemValue, itemIndex) => { this.setState({ itemValue }); this.lookupNearbyTherapists(this.props.latitude, this.props.longitude, itemValue) }}>
              <Picker.Item label={I18n.t('i18n_max2km')} value="2" />
              <Picker.Item label={I18n.t('i18n_max10km')} value="10" />
              <Picker.Item label={I18n.t('i18n_max30km')} value="30" />
              <Picker.Item label={I18n.t('i18n_morethan30km')} value="100000" />
            </Picker>
          </View>
          <View style={{ width: '98%' }}>
            <View key={Math.random()} style={{ width: '98%' }}>
              <View key={Math.random()} style={{ height: 40, width: '95%' }}>
                <ListButton key={Math.random()} onPress={e => this.onPressList(296)}>
                  Administrator
                </ListButton>
              </View>
            </View>
            <View>
                {Array.isArray(this.state.listeler) ?
                  this.state.listeler.map((liste) => (
                    <View key={liste.index+ Math.random()} style={{ width: '98%' }}>
                      <View key={Math.random()} style={{ height: 40, width: '95%' }}>
                        <ListButton key={Math.random()} onPress={e => this.onPressList(liste.index)}>
                          {liste.title}
                        </ListButton>
                      </View>
                    </View>
                  ))
                  : <Spinner size="small" />
                }
            </View>
          </View>
        </View>
      );
    } else {
      return <Text>{I18n.t('i18n_loading')}</Text>
    }
  }
}