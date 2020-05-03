import React from 'react'
import Layout from "../../hoc/layout/Layout"
import ContactForm from "./ContactForm"
import './ContactUs.scss'
import data from '../../constants'
const layout = data.layout.contact

const ContactUs = () => {
    return (
        <div className={'contact-us default-content-height'}>
            <ContactForm />
        </div>
    )
}

export default Layout(ContactUs,layout)

