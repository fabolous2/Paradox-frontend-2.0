import React from 'react';
import './Game.css';
import {useNavigate} from "react-router-dom";

function Game({game}) {
    const {title, Image, id} = game;
    const navigate = useNavigate();
    return <>
        <div onClick={() => {
            navigate(`/game/${game.id}`)
        }} className='card__1x1 vertical-padding horizontal-padding'>
            <img className='card__1x1__image' src={Image} alt={title}/>
            <div className="card__1x1__title text__center">
                <span className="mt-05">
                    {title}
                </span>
            </div>
        </div>
    </>
}

export default Game;