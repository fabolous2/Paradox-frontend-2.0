import React, {useState} from 'react';
import './Header.css';
import Button from "../Button";
import profile from '../../images/profile.png';
import starOutlined from '../../images/star_outlined.png';
import search from '../../images/search.png';
import {useNavigate} from "react-router-dom";

function Header() {
    const theme = window.Telegram.WebApp.colorScheme;

    const navigate = useNavigate();
    return <div className='header'>
        <div className="search__container">
            <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className='search__icon' src={search} alt=""/>
            <input
                placeholder='Искать игру или товар...'
                className="search__bar" type="text"/>
        </div>
        <Button image_invert={theme === 'dark'} image={starOutlined}></Button>
        <Button image_invert={theme === 'dark'} image={profile}
                onClick={() => {
                    navigate('/profile')
                }}></Button>
    </div>
}

export default Header;