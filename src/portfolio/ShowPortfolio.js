import React, { Component } from 'react'
import { TouchableHighlight, Modal, Text, Alert, View, StyleSheet, Image } from 'react-native'
import I18n from 'ex-react-native-i18n';
import { Card, CardDikey, CardYatay, Spinner } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tub: {

  },
});
export default class ShowPortfolio extends Component {
  state = {
    email: null,
    urunler: [],
    modalVisible: false,
    activepicture: null,
    activead: null,
    activeaciklama: null,
  };
  async componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onGetPortfolioResponse(responseJson) {
    if (this._mounted) {
      this.setState({
        urunler: responseJson
      });
    }
  }
  getPortfolio() {
    ////Alert.alert(this.props.limit)
    let myURL = 'https://www.masseusenearme.com:443/portfolio_get_map.php' + '?email=' + this.props.email + '&limit=' + this.props.limit;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onGetPortfolioResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  render() {
    this.getPortfolio();
    const yok = '<View><Text>No, portfolio found</Text></View>';
    if (this.state.urunler != null) {
      return (
        <View style={{ marginTop: 22 }} key={Math.random()}>
          <Modal
            key={Math.random()}
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              //Alert.alert('Modal has been closed.');
            }}>
            <View style={{ marginTop: 22 }} key={Math.random()}>
              <TouchableHighlight
                key={Math.random()}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{ fontSize: 40, paddingLeft: 10 }}>X</Text>
              </TouchableHighlight>
              <View key={Math.random()}>
                <Image key={Math.random()} style={{ height: '85%', width: '100%', paddingLeft: 100 }} source={{ uri: 'https://www.masseusenearme.com:443/resimler/portfolio/buyuk-' + this.state.activepicture }} />
                <Text key={Math.random()} >{this.state.activetarih}</Text>
                <Text key={Math.random()} >{this.state.activead}</Text>
                <Text key={Math.random()} >{this.state.activeaciklama}</Text>
              </View>
            </View>
          </Modal>
          <CardDikey key={Math.random()}>
            {
              Array.isArray(this.state.urunler) ?
                this.state.urunler.map((urun, index) => (
                  <Card key={Math.random()}>
                    <TouchableHighlight key={Math.random()}
                      onPress={() => {
                        this.setModalVisible(true);
                        this.setState({
                          activepicture: urun.resimler,
                          activead: urun.urunadi,
                          activeaciklama: urun.urunaciklamasi,
                          activetarih: urun.uretimtarihi,
                        })
                      }}><Image key={urun.upid+Math.random()} style={{ width: 50, height: 50 }} source={{ uri: 'https://www.masseusenearme.com:443/resimler/portfolio/' + urun.resimler }} />
                    </TouchableHighlight>
                  </Card>
                ))
                : <Spinner key={Math.random()} size="small" />
            }
          </CardDikey>
        </View>
      );
    } else {
      return (
        <CardDikey key={Math.random()}>
          <Card key={Math.random()}>
            <Text key={Math.random()}>{I18n.t('i18n_no_massage')}</Text>
          </Card>
        </CardDikey>
      );
    }
  }
  f
}