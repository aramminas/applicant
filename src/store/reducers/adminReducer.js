import {UPDATE_PAGE_SECTION} from '../constants'

const initState = {
    pageSection: false
}

const adminReducer = (state= initState,{type,payload}) => {
    switch (type) {
        case UPDATE_PAGE_SECTION:
            return {
                ...state,
                pageSection: payload
            }
        default:
            return state
    }
}

export default adminReducer