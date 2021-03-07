import React, { useState } from 'react'
import { View , TextInput, Image, Button} from 'react-native';

import firebase from 'firebase'
require('firebase/firestore')
require('firebase/firebase-storage')

export default function SavePost(props, {navigation}) {
    const [caption, setCaption] = useState('')
    
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const userId = firebase.auth().currentUser.uid;
        const folder = Math.random().toString(36);
        const childPath = `post/${userId}/${folder}`;
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);
        
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot);
        }

        task.on('state_changed', taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadURL) => {
        const userId = firebase.auth().currentUser.uid;

        firebase
            .firestore()
            .collection('posts')
            .doc(userId)
            .collection('userPosts')
            .add({
                downloadURL,
                caption,
                creationDate: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop();
            }))

    }
    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}} />
            <TextInput
                placeholder="Description"
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button 
                title="Save"
                onPress={() => uploadImage()}
            />
        </View>
    )
}
