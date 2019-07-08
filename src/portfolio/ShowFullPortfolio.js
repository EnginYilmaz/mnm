import React, { Component } from 'react';
import { ScrollView, Platform, Text, TextInput, View, StyleSheet } from 'react-native';
import ShowProfile from '../map/ShowProfile.js';
import ShowPortfolio from './ShowPortfolio.js';
import Constants from 'expo-constants';
import I18n from 'ex-react-native-i18n';
import { Button, Card, CardDikey, Spinner } from '../common';
import StarRating from 'react-native-star-rating';

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

export default class ShowFullPortfolio extends Component {
  state = {
    adsoyad: null,
    email: null,
    patientEmail: null,
    sonuctekst: null,
    comment: null,
    starCount: null,
    errorMessage: null,
    yorumlar:
      [{
        "yorum": "No, comment made yet",
      }],
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  async componentDidMount() {
    this._mounted = true;
  }

  onQueryUserResponse(responseJson) {
    if (this._mounted) {
      this.setState({
        adsoyad: responseJson.adsoyad,
        email: this.props.navigation.getParam('therapist_email'),
        uid: responseJson.uid,
        ozgecmis: responseJson.ozgecmis,
        gender: responseJson.gender,
      });
    }
  }
  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    }

    ////Alert.alert(this.props.navigation.getParam('patient_email'));

    let myURL = 'https://www.masseusenearme.com:443/query_user.php' + '?email=' + this.props.navigation.getParam('therapist_email');
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onQueryUserResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
    this.getLastComments();
    this.getStars();
  }
  componentWillUnmount() {
    this._mounted = false
  }
  renderCommentButton() {
    if (this._mounted) {
      if (this.state.loading) {
        return <Spinner size="small" />;
      } else {
        return (
          <Button onPress={this.onCommentPress.bind(this)} style={{ width: 100 }}>
            {I18n.t('i18n_send_comment')}
          </Button>
        );
      }
    }
  }
  onCommentPressResponse(responseJson){
    if (this._mounted) {
      this.setState({
        sonuctekst: responseJson.basari,
        loading: false,
      });
    }
  }
  onCommentPress() {
    this.setState({ error: '', loading: true });
    let myURL = 'https://www.masseusenearme.com:443/comment_update_put.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.props.navigation.getParam('patient_email') + '&Comment=' + this.state.comment + '&Yildiz=' + this.state.starCount;
    ////console.log(myURL);
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onCommentPressResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
    this.getStars();
    this.getLastComments();
  }

  onGetLastCommentsResponse(responseJson){
    if (responseJson) {
      this.setState({
        yorumlar: responseJson,
      });
    }
  }

  getLastComments() {
    this.setState({ error: '', loadingCommentsHistory: true });
    //this.props.propsnav.navigate('sendmessage', { email: this.props.email })
    ////Alert.alert(this.state.starCount+' ');
    ////////console.log('https://www.masseusenearme.com:443/comment_history_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.state.PatientEmail);
    myURL = 'https://www.masseusenearme.com:443/comment_history_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.props.navigation.getParam('patient_email');
    
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onGetLastCommentsResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  onGetStarsResponse(responseJson) {
    if (responseJson) {
      this.setState({
        starCount: Number(responseJson.ortalama),
      });
    }
  }
  getStars() {
    this.setState({ error: '', loadingCommentsHistory: true });
    //this.props.propsnav.navigate('sendmessage', { email: this.props.email })
    ////Alert.alert(this.state.starCount+' ');
    ////////console.log('https://www.masseusenearme.com:443/comment_star_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email') + '&PatientEmail=' + this.state.PatientEmail);
    let myURL = 'https://www.masseusenearme.com:443/comment_star_get.php' + '?MassagerEmail=' + this.props.navigation.getParam('therapist_email');
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onGetStarsResponse(request.response);
      } else {
        console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }

  render() {
    if (this.state.email) {
      const yok = '<CardDikey><Text>No comment found</Text></CardDikey>';
      return (
        <View style={{ width: '100%', height: '100%' }}>
          <Card key={Math.random()}>
            <CardDikey>
              <ShowProfile
                key={this.state.uid+Math.random()}
                propsnav={this.props.navigation}
                style={styles.profile}
                adsoyad={this.state.adsoyad}
                email={this.state.email}
                ozgecmis={this.state.ozgecmis}
                gender= {this.state.gender}
              />
            </CardDikey>
            <CardDikey key={Math.random()}>
              <ScrollView horizontal={true}>
                <ShowPortfolio key={this.state.uid +Math.random()} style={styles.tub} email={this.state.email} limit='11' />
              </ScrollView>
            </CardDikey>
            <CardDikey key={Math.random()}>
              <TextInput
                key={Math.random()}
                style={{ height: 60, width: '90%', borderColor: 'black', borderWidth: 4, borderRadius: 15, margin: 10, padding: 10, backgroundColor: '#ffee8f' }}
                onChangeText={(comment) => this.setState({ comment })}
                value={this.state.comment}
              />
            </CardDikey>
            <CardDikey key={Math.random()}>
              <StarRating
                key={Math.random()}
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'pink'}
              />
              {this.renderCommentButton()}
            </CardDikey>
            <CardDikey key={Math.random()}>
              <Text key={Math.random()} style={styles.errorTextStyle}>
                {this.state.error}
              </Text>
            </CardDikey>
            <Card>
              <ScrollView style={{ height: 100 }}>
                {
                  Array.isArray(this.state.yorumlar) ?
                    this.state.yorumlar.map((yorumvar, index) => (
                      <CardDikey key={Math.random()}><Text key={yorumvar.sayac + Math.random()}>{yorumvar.yorum}</Text></CardDikey>
                    ))
                    : <Spinner key={Math.random()} size="small"/>
                }
              </ScrollView>
            </Card>
          </Card>
        </View>
      );
    } else {
      return (
        <Text>
          No, portfolio found for this therapist.
        </Text>
      );
    }
  }
}