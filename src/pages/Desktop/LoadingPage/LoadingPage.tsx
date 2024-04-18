import React from 'react';
import './LoadingPage.css';
import {getIconImage} from "../../../App";

export default function LoadingPage() {
    return (
        <div className="loading-container">
            <img src={getIconImage('loading.png')} alt="loading" className="loading-icon"/>
        </div>
    );
}
