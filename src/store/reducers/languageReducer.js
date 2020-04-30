import {CHANGE_LANGUAGE} from '../constants'

const initState = {
    language: "EN"
}

const languageReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case CHANGE_LANGUAGE:
            return {
                ...state,
                language: payload
            }
        default:
            return state
    }
}

export default languageReducer