import React, {useState} from 'react';
import './Card.css';
import starFilled from '../../images/star.png';
import starOutlined from '../../images/star_outlined.png';
import {useNavigate} from "react-router-dom";

function Card({item}) {
    const navigate = useNavigate();
    const {title, subtitle, Image, price, id} = item;
    return <div onClick={() => {
        navigate(`/product/${id}`)
    }} className='card horizontal-padding' >
        <div className="image_container">
            <img className='card__image' src={Image} alt={title}/>
        </div>
        <div className="card__title">
            <h4>
                {title}
            </h4>
            <h4>{price} ₽</h4>
        </div>
        <div className="card__title">
            <small>{subtitle}</small>
            {/*<div>*/}
            {/*    {stars.map((star, index) => <img key={index} style={{width: "15px"}} src={star === 1 ? starFilled : starOutlined}*/}
            {/*                                     alt=""/>)}*/}
            {/*</div>*/}
        </div>
    </div>
}

export default Card;