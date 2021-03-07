import {
    USERS_DATA_STATE_CHANGED,
    USERS_POST_STATE_CHANGED,
    CLEAR_DATA
} from "../constants"

const initialState = {
    users: [],
    usersLoaded: 0,
}

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGED:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_POST_STATE_CHANGED:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                users: state.users.map(user => user.uid === action.uid ?
                    { ...user, post: action.posts } : user)
            }
        case CLEAR_DATA:
            return {
                users: [],
                usersLoaded: 0,
            }
        default:
            return state
    }

}