import React from 'react'
import {connect,useSelector} from 'react-redux'
import update_page_section from  '../../store/actions/adminAction'
import Firebase from '../../Firebase'

import './Admin.scss'

const Admin = (props) => {
    const {pageSection} = useSelector(state => state.admin)
    let buttonTest = pageSection ? 'Show users' : 'Show tests'

    const addUser = () => {
        const database = Firebase.database.ref()
        database.child("users").child(1).set({
            first_name: 'first_name',
            last_name: 'last_name',
            email: 'email',
            phone: '+374321123456',
            role: 2,
            birthday: '10/10/2000',
            level_of_professionalism: 1
        })
    }

    return (
        <div className={'admin'}>
            Admin
            {pageSection ?
                <div>Users ...</div> :
                <div>Tests ...</div>
            }
            <button onClick={() => props.changeSection(!pageSection)}>
                {buttonTest}
            </button>

            <hr/>
            <button
                onClick={() => addUser()}
            >add user</button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeSection: (data) => {dispatch(update_page_section(data))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Admin)