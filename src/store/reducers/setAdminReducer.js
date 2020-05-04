import {SET_ADMIN_DATA} from '../constants'

const initState = {
    adminId: '',
    isLogged: false,
    role: 1
}

const setAdminReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case SET_ADMIN_DATA:
            return {
                ...state,...payload
            }
        default:
            return state
    }
}

export default setAdminReducer