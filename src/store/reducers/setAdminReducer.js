import {SET_ADMIN_DATA,SET_NAV_ID} from '../constants'

const initState = {
    adminId: '',
    isLogged: false,
    status: false,
    role: 1,
    navId: 1,
    badge: 0,
}

const setAdminReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case SET_ADMIN_DATA:
            return {
                ...state,...payload
            }
        case SET_NAV_ID:
            return {
                ...state,
                navId: payload
            }
        default:
            return state
    }
}

export default setAdminReducer