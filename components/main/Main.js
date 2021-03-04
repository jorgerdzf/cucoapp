import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser } from '../../redux/actions/index'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Feed from '../feed/Feed'
import Profile from '../profile/Profile'

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return null;
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
              <Tab.Screen name="Feed" component={Feed} 
                options={{ 
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons 
                            name="home" 
                            color={color} size={26}
                        />
                    )
                }}
              />
              <Tab.Screen name="Post" component={EmptyScreen} 
                listeners={({navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("AddPost")
                    }
                })}
                options={{ 
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons 
                            name="plus-box" 
                            color={color} size={26}
                        />
                    )
                }}
              />
              <Tab.Screen name="Profile" component={Profile} 
                options={{ 
                    tabBarIcon: ({color,size}) => (
                        <MaterialCommunityIcons 
                            name="account-circle" 
                            color={color} size={26}
                        />
                    )
                }}
              />
            </Tab.Navigator>
          );
    }
}
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main);