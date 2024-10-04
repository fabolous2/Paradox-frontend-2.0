// import React, {useCallback} from 'react';
import './Header.css';
import Button from "../Button";
import profile from '../../images/profile.png';
import starOutlined from '../../images/star_outlined.png';
import {useNavigate} from "react-router-dom";
import { SearchBar } from '../SearchBar/SearchBar';


function Header() {
    const theme = window.Telegram.WebApp.colorScheme;
    const navigate = useNavigate();

    return <div className='header'>
        <SearchBar onClick={() => {
            navigate('/search?query=none')
        }}/>
        <Button image_invert={theme === 'dark'} image={starOutlined} onClick={() => {
            navigate('/feedbacks')
        }}></Button>
        <Button image_invert={theme === 'dark'} image={profile}
                onClick={() => {
                    navigate('/profile')
                }}></Button>
    </div>
}

export default Header;