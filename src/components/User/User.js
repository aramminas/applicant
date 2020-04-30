import React from "react"
import "./User.scss"
import Layout from "../../hoc/layout/Layout"
import UserForm from "./UserForm"

const User = () => {
    return (
        <div className={'user default-content-height'}>
            <UserForm />
        </div>
    )
}

export default Layout(User)