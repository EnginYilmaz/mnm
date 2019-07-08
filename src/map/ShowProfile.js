import React, { Component } from 'react'
import { TouchableOpacity, Alert, Text, View, StatusBar, Image } from 'react-native'
import { Cv, Button, Card, Uzerinde, CardDikey, CardYatay } from '../common';
import I18n from 'ex-react-native-i18n';
import {withNavigation} from 'react-navigation';

class ShowMapProfile extends Component {
  static navigationOptions = {
    drawerLabel: 'showprofile',
    drawerIcon: ({ tintColor }) => (
      <Image
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  }
  constructor(props) {
    super(props);
  }
  state = {
    adsoyad: null,
    email: null,
  };
  onMessagePress() {
    this.props.propsnav.navigate('sendmessage', { email: this.props.email })
  }
  render() {
    let pic = {
      uri: 'https://www.masseusenearme.com:443/resimler/kullaniciresmi/' + this.props.email + '.jpeg' + '?'+ Math.random(),
    };

    let gender = '';
    switch (this.props.gender) {
      case 'male': gender = I18n.t('i18n_gender_male');
        break;
      case 'female': gender = I18n.t('i18n_gender_female');
        break;
      case 'other': gender = I18n.t('i18n_gender_other');
        break;
      case 'na': gender = I18n.t('i18n_gender_na');
        break;
    }
    if (this.props.ozgecmis && this.props.email) {
      return (
        <CardDikey>
          <Card>
            <Image source={pic} style={{ width: 100, height: 150, borderRadius: 20 }} />
            <Text>{this.props.adsoyad}</Text>
            <Text>{gender}</Text>
          </Card>
          <Cv>
            <Text>{this.props.ozgecmis}</Text>
          </Cv>
          <Card>
            <Button onPress={this.onMessagePress.bind(this)}>
              {I18n.t('i18n_sendmessage')}
            </Button>
          </Card>
        </CardDikey>
      );
    } else if (!this.props.ozgecmis && this.props.email) {
      return (
        <CardDikey>
          <Card>
            <Image source={pic} style={{ width: 100, height: 150, borderRadius: 20 }} />
          </Card>
          <Uzerinde>
            <Text>{this.props.adsoyad}</Text>
            <Text>{gender}</Text>
          </Uzerinde>
        </CardDikey>
      );
    } else {
      return (<View><Text>Swipe around the maps to find profiles on this area</Text></View>);
    }
  }
}

export default withNavigation(ShowMapProfile);