import {ADD_UPDATE_USER_DATA} from '../constants'

const initState = {
    userId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthday: '',
    password: null,
    isLogged: false,
    role: 2
}

const userReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case ADD_UPDATE_USER_DATA:
            return {
                ...state,...payload
            }
        default:
            return state
    }
}

export default userReducer