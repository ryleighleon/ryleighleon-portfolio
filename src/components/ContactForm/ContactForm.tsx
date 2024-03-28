import React, { useState, ChangeEvent, FormEvent } from 'react';
import './ContactForm.css';
import {getRegularImage} from "../../App";

interface FormData {
    name: string;
    subject: string;
    body: string;
}

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        subject: '',
        body: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Assuming formData is an object with name, subject, and body properties
        const { name, subject, body } = formData;

        // Construct the mailto link
        const mailtoLink = `mailto:ryleighleon@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nBest,\n${name}`)}`;

        // Open the default email client with the mailto link
        window.location.href = mailtoLink;

        // Reset the form after submission if needed
        setFormData({
            name: '',
            subject: '',
            body: '',
        });
    };


    return (
        <div className={'contact-container'}>
            <div className={'contact-info'}>
                <span className={'contact-info-title'}>Connect with Me!</span>
                <span className={'contact-info-body'}>Interested in learning more about me, my work or how we can collaborate on an upcoming project? Feel free to reach out anytime, I would be more than happy to chat.</span>
                <a href='mailto:ryleighleon@gmail.com' className={'contact-email'}>ryleighleon@gmail.com</a>
                <div className={'contact-socials'}>
                    <a href={'https://www.linkedin.com/in/ryleigh-leon'} target="_blank" rel="noopener noreferrer">
                        <img src={getRegularImage(`LinkedInBlack.png`)} alt={'LinkedIn'} className={'social-icon'}/>
                    </a>
                    <a href={'https://www.instagram.com/ryleighleon.design'} target="_blank" rel="noopener noreferrer">
                        <img src={getRegularImage(`InstagramBlack.png`)} alt={'Instagram'} className={'social-icon'}/>
                    </a>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={'contact-form'}>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={'contact-input'}
                    placeholder={'Name'}
                />
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={'contact-input'}
                    placeholder={'Subject'}
                />
                <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                    className={`contact-input contact-input-text-area`}
                    placeholder={'Type your message here...'}
                ></textarea>
                <button type="submit" className={'contact-submit-button'}>Email</button>
            </form>
        </div>
    );
};