import React, {useState, useEffect} from 'react'
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import {connect} from 'react-redux'

function Profile(props) {
    const [userPost, setUserPost] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const {currentUser, posts} = props;
        
        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser);
            setUserPost(posts);
        } else {
            firebase.firestore()
            .collection('users')
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())
                } else {
                    console.log('does not exists')
                }
            })

            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .orderBy('creationDate', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data
                    }
                })
                setUserPost(posts)
            })
        }
    }, [props.route.params.uid])

    if(user === null){
        return <View></View>
    } 

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPost}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image
                            style={styles.image}
                            source={{uri: item.downloadURL}}
                            />
                        </View>
                        
                    )}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts

})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    containerImage: {
        flex: 1 / 2
    }
})
export default connect(mapStateToProps, null)(Profile);