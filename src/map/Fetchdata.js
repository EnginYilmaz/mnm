import React, { Component } from 'react'
import { AsyncStorage, Text, View, StyleSheet, Switch, Alert, StatusBar } from 'react-native'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';

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

export default class Fetchdata extends Component {
  constructor(props) {
    //constructor
    super(props);
  };

  state = {
    basari: false,
    markers: [],
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
  onUserValidateReturns(responseJson) {
    if (this._mounted) {
      this.setState({ basari: responseJson });
    }
  }
  componentDidMount = () => {
    this._mounted = true;
    myURL = 'https://www.masseusenearme.com:443/user_validate.php' + '?email=' + this.getKey('@massage:myemail') + '&password=' + this.getKey('@massage:password')
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onUserValidateReturns(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }

  onRegionChangedResponse(responseJson) {
    if (responseJson) {
      if (this._mounted) {
        this.setState({ markers: responseJson });
      }
    }
  }
  onRegionChanged(region) {
    myURL = 'https://www.masseusenearme.com:443/query_maps.php' + '?latitude=' + region.latitude + '&longitude=' + region.longitude;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onRegionChangedResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  onPressMarker(sayac) {
    this.props.callbackMethod(sayac);
  }
  render() {
    ////Alert.alert(enlem);
    //let currentposition = { this.props.latitude + 0.001, this.props.longitude + 0.001}
    const yok = '';
    if (this.props.latitude && this.props.longitude) {
      return (
        <MapView
          style={styles.map}
          showsUserLocation={false}
          initialRegion={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          onRegionChange={this.onRegionChanged.bind(this)}
        >
          {
            this.state.markers ?
              this.state.markers.map((marker) => (
                <Marker key={marker.index} coordinate={marker.latlng} image={require('../../assets/massagecircle.png')} title={marker.title} onPress={e => this.onPressMarker(marker.index)} />
              ))
              : yok
          }
        </MapView>
      );
    } else {
      return <Text>loading ...</Text>
    }
  }
}
