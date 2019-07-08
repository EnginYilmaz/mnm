import React, { Component } from 'react'
import { Text, Alert, View, StyleSheet, Image } from 'react-native'
import I18n from 'ex-react-native-i18n';
import { Card, CardDikey, CardYatay, Spinner } from '../common';
import StarRating from 'react-native-star-rating';

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
    sonyildiz: null,
    sonyorum: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5
    };
  }
  async componentDidMount() {
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  onGetPortfolioResponse(responseJson) {
    if (this._mounted) {
      this.setState({
        sonyildiz: responseJson.yildiz,
        sonyorum: responseJson.yorum,
      });
    }
  }
  getPortfolio() {
    ////Alert.alert(this.props.limit)
    myURL= 'https://www.masseusenearme.com:443/portfolio_get_frontpage.php' + '?email=' + this.props.email;
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 200) {
        this.onGetPortfolioResponse(request.response);
      } else {
        //console.warn('error');
      }
    };
    request.open('GET', myURL);
    request.send();
  }
  render() {
    this.getPortfolio();
    if (this.state.sonyildiz != null && this.state.sonyorum != null) {
      return (
        <Card>
          <CardDikey>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={parseFloat(this.state.sonyildiz)}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'pink'}
            />
          </CardDikey>
          <CardDikey>
            <Text>{I18n.t('i18n_avarage_rating')}</Text>
          </CardDikey>
        </Card>
      );
    } else {
      return (
        <Card style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
          <CardYatay key={Math.random()} style={{ width: '30%', height: '50%' }}>
            <StarRating
              key={Math.random()}
              disabled={true}
              maxStars={5}
              rating={parseFloat(this.state.sonyildiz)}
              selectedStar={(rating) => this.onStarRatingPress(rating)}
              fullStarColor={'gray'}
            />
          </CardYatay>
          <CardYatay key={Math.random()} style={{ width: '30%', height: '50%' }}>
          <Text>{I18n.t('i18n_no_rating_found')}</Text>
          </CardYatay>
        </Card>
      );
    }
  }
}
