import React, {useCallback} from 'react';
import './SearchBar.css';
import search from '../../images/search.png';
import {useNavigate} from "react-router-dom";


const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

export function SearchBar() {
    const theme = window.Telegram.WebApp.colorScheme;
    const navigate = useNavigate();

    const handleSearch = useCallback((searchTerm) => {
        navigate(`/search?query=${searchTerm}`);
    }, [navigate]);

    const debouncedSearch = useCallback(
        debounce((searchTerm) => handleSearch(searchTerm), 500),
        [handleSearch]
    );

    const handleFocus = () => {
        navigate('/search');
    };

    return (
        <div className="search__container">
            <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className='search__icon' src={search} alt=""/>
            <input
                placeholder='Искать игру или товар...'
                className="search__bar" type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                onFocus={handleFocus}
            />
        </div>
    );
}