import React, { Component } from 'react'
import { Image, AsyncStorage, Text, View, StyleSheet, RefreshControl, ScrollView } from 'react-native'
import { Button, Card, CardDikey, Spinner } from '../common';
import I18n from 'ex-react-native-i18n';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tub: {

  },
});
I18n.initAsync();

class GetMessage extends Component {

  constructor(props) {
    super(props);
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  state = {
    email: null,
    messages: [],
  };

  onGetMessageResponse(responseJson) {
    if (this._mounted) {
      this.setState({
        messages: responseJson,
        refreshing: false,
      });
    }
  }

  async onRefresh() {

    this.setState({ refreshing: true });

    const emailim = await AsyncStorage.getItem('@massage:myemail');
    ////////console.log(emailim);
    if (this._mounted) {
      this.setState({ error: '', loading: true, email: emailim });
    }
    let myURL = 'https://www.masseusenearme.com:443/get_message.php' + '?email=' + emailim;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onGetMessageResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }

  async componentDidMount() {
    this._mounted = true;
    this.onRefresh();
  }

  componentWillUnmount() {
    this._mounted = false
  }

  _refreshControl(){
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={()=>this.onRefresh()} />
    )
  }

  render() {
    if (this.state.messages) {
      const yok = '<View><Text>No, message found</Text></View>';
      return (
        <View style={styles.container}>
          <ScrollView refreshControl={this._refreshControl()}>
            <View style={styles.tub}>
              {
                Array.isArray(this.state.messages) ?
                  this.state.messages.map((message, index) => (
                    <Card key={Math.random()}>
                      <CardDikey key={index+Math.random()}>
                        <View><Text key={'tarih' + message.tarih +Math.random()}>{message.tarih} - </Text></View>
                        <View><Text key={'name' + message.tarih +Math.random()} >{message.name} - </Text></View>
                      </CardDikey>
                      <CardDikey key={index+Math.random()}>
                        <View><Text key={'mesaj' + message.tarih +Math.random()} >{message.mesaj} </Text></View>
                      </CardDikey>
                      <CardDikey key={index+Math.random()}>
                        <View>
                          <Button key= {+Math.random()} onPress={() => this.props.navigation.navigate('sendmessage', { email: message.name })}>
                            {I18n.t('i18n_reply')}
                          </Button>
                        </View>
                      </CardDikey>
                    </Card>
                  ))
                  : <Spinner size="small" />
              }
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text>{I18n.t('i18n_nomessage_inbox')}</Text>
        </View>
      );
    }
  }
}

export default GetMessage;