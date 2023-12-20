import React from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import './ContactPage.css';

export default function ContactPage(){
    return (
        <div className={'contact-page-container page'}>
            <ContactForm color={'gray'}/>
        </div>
    )
}