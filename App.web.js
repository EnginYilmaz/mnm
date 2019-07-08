import {
  createNavigator,
  SwitchRouter,
  getActiveChildNavigationOptions
} from "@react-navigation/core";

import Mapscreen from './src/map/Mapscreen.js';
import Listscreen from './src/listing/Listscreen.js';
import MyAccountForm from './src/user/MyAccountForm.js';
import Plainregister from './src/user/Plainregister.js';
import ForgetPasswordScreen from './src/user/ForgetPasswordScreen.js';
import MyPortfolio from './src/portfolio/MyPortfolio.js';
import ShowFullPortfolio from './src/portfolio/ShowFullPortfolio.js';
import MyMessages from './src/messages/GetMessage.js';
import CameraScreen from './src/user/CameraScreen.js';
import CameraPortfolioScreen from './src/portfolio/CameraPortfolioScreen.js';
import SendMessage from './src/messages/SendMessage.js';

import AppView from './AppView.js';

const Menu = createNavigator(
  SwitchRouter({
    Mapscreen,
    Listscreen,
    MyAccountForm,
    Plainregister,
    ForgetPasswordScreen,
    MyPortfolio,
    ShowFullPortfolio,
    MyMessages,
    CameraScreen,
    CameraPortfolioScreen,
    SendMessage,
  }),
  {
    navigationOptions: ({ navigation, screenProps }) => {
      const options = getActiveChildNavigationOptions(navigation, screenProps);
      return { title: options.title };
    }
  }
);
Menu.path = "menu";

const AppNavigator = createNavigator(
  AppView,
  SwitchRouter({
    Menu,
  }),
  {}
);

export default AppNavigator;