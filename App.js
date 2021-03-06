import { StatusBar } from 'expo-status-bar';

import React, { Component } from 'react';
import { View, Text } from 'react-native'

import * as firebase from 'firebase'
import 'firebase/firestore'
import { firebaseConfig } from './config/firebase.js'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import { Register } from './components/auth/Register'
import Login from './components/auth/Login.js'
import Main from './components/main/Main'
import AddPost from './components/post/AddPost'
import SavePost from './components/post/SavePost.js';
import Profile from './components/profile/Profile';

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={Main} />
              <Stack.Screen name="AddPost" component={AddPost} navigation={this.props.navigation}/>
              <Stack.Screen name="SavePost" component={SavePost} navigation={this.props.navigation}/>
              <Stack.Screen name="Profile" component={Profile} navigation={this.props.navigation}/>
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }

  }
}

export default App;