import { USER_STATE_CHANGED, USER_POST_STATE_CHANGED } from '../constants/index'
import firebase from 'firebase'

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    dispatch({
                        type: USER_STATE_CHANGED,
                        currentUser: snapshot.data()
                    })
                } else {
                    console.log('does not exists')
                }
            })
    })
}
export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
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
                dispatch({
                    type: USER_POST_STATE_CHANGED,
                    posts
                })
            })
    })
}