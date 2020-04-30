import {UPDATE_WELCOME} from '../constants'

const initState = {
    welcome: false
}

const welcomeReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case UPDATE_WELCOME:
            return {
                ...state,
                welcome: payload
            }
        default:
            return state
    }
}

export default welcomeReducer