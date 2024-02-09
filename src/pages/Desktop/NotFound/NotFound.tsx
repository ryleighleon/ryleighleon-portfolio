import React from "react";
import './NotFound.css';
import {useNavigate} from "react-router-dom";

export default function NotFound(){
    const navigate = useNavigate();
    function redirectToHome(){
        navigate('/');
    }
    return (
        <div className={'not-found-container'}>
            <span className={'not-found-title'}>Page Not Found</span>
            <div>
                <span className={'not-found-body'}>Click </span>
                <span className={'not-found-link not-found-body'} onClick={redirectToHome}>here</span>
                <span className={'not-found-body'}> to return to the Home Page</span>
            </div>
        </div>
    );
}