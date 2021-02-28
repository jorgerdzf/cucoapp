import React, { Component } from 'react'
import firebase from 'firebase'
import { View, Button, TextInput } from 'react-native'

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.onSignIn = this.onSignIn.bind(this);
    }
    onSignIn() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    render() {
        return (
            <View>
                <TextInput
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })} />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })} />
                <Button 
                    title="Sing In"
                    onPress={() => this.onSignIn()}/>
            </View>
        )
    }
}

export default Login;