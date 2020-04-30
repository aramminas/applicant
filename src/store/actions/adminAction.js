import {UPDATE_PAGE_SECTION} from '../constants'

const update_page_section = (data) => {
    return {
        type: UPDATE_PAGE_SECTION, payload : data
    }
}

export default update_page_section