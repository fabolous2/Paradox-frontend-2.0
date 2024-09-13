import React, {useState} from 'react';
import DetailImage from '../../images/30gemsPreview.jpg';
import Button from "../../Components/Button";

function ProductItem() {

    return <div style={{height: "100vh"}} className='relative'>
        <div className="">
            <img className='card__image rounded-1' src={DetailImage} alt='alt'/>
        </div>
        <div className="flex column justify-between px-08 py-04">
            <div className="flex justify-between">
                <b>
                    30 gems
                </b>
                <b>300 ₽</b>
            </div>
            <div className="flex py-04">
                <h3>Описание</h3>
            </div>
            <span className="bg-lightgray rounded px-08 word-pre py-08">
                Вы выбрали товар | {'\n'}
                Введите почту Supercell ID от вашего аккаунта
            </span>
        </div>
        <div className="bottom-0 left-0 absolute w-100 flex">
            <div className="px-04 w-100 py-04">
                <Button onClick={() => {}} className="w-100 text__center"
                        type="checkout"
                        title="Купить"></Button>
            </div>
        </div>
    </div>
}

export default ProductItem;