import {SET_ADMIN_DATA} from '../constants'

const set_admin_data = (data) => {
    return {
        type: SET_ADMIN_DATA, payload : data
    }
}

export default set_admin_data