import {UPDATE_PAGE_SECTION,SET_NAV_ID} from '../constants'

export const update_page_section = (data) => {
    return {
        type: UPDATE_PAGE_SECTION, payload : data
    }
}

export const set_nav_id = (data) => {
    return {
        type: SET_NAV_ID, payload : data
    }
}