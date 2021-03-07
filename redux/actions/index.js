import {
    USER_STATE_CHANGED,
    USER_POST_STATE_CHANGED,
    USER_FOLLOWING_STATE_CHANGED,
    USERS_DATA_STATE_CHANGED,
    USERS_POST_STATE_CHANGED,
    CLEAR_DATA
} from '../constants/index'
import firebase from 'firebase'

export function clearData() {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}
export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
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
export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    console.log('following id', id)
                    return id
                })
                dispatch({
                    type: USER_FOLLOWING_STATE_CHANGED,
                    following
                });
                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            })
    })
}
export function fetchUsersData(uid) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if (!found) {
            firebase.firestore()
                .collection('users')
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id;

                        dispatch({
                            type: USERS_DATA_STATE_CHANGED,
                            user
                        });

                        dispatch(fetchUsersFollowingPosts(user.id));

                    } else {
                        console.log('does not exists')
                    }
                })
        }
    })
}
export function fetchUsersFollowingPosts(uid) {
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .orderBy('creationDate', 'asc')
            .get()
            .then((snapshot) => {

                const uid = snapshot.query.EP.path.segments[1];
                const user = getState().usersState.users.find(el => el.uid === uid);

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data,
                        user
                    }
                })
                dispatch({
                    type: USERS_POST_STATE_CHANGED,
                    posts,
                    uid,
                })
            })
    })
}