import {ADD_UPDATE_USER_DATA} from '../constants'

const add_update_user_data = (data) => {
    return {
        type: ADD_UPDATE_USER_DATA, payload : data
    }
}

export default add_update_user_data