import React, {useState} from 'react';
import './OrderDetails.css'
import avatar from '../../images/avatar.jpg';
import Button from "../../Components/Button";
import arrowGreater from '../../images/arrow_greater.png';
import {useParams} from 'react-router-dom';

function OrderDetails() {
    const {id} = useParams();
    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Информация о заказе </h3>
        </div>
        <div className=" flex column horizontal-padding h-full gap-1 vertical-padding">
            <div className="flex column">
                <span className="subtitle">ID заказа</span>
                <span>z54asd6-51c3z6a5s4-dd3512c-asd123cx-asd</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Дата и время заказа</span>
                <span>03.05.2024 21:56:21</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Товар</span>
                <span className="text-blue" onClick={() => {
                }}>80 гемов</span>
            </div>

            <div className="flex column">
                <span className="subtitle">ID товара</span>
                <span>z54asd6-51c3z6a5s4-dd3512c-asd123cx-asd</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Стоимость</span>
                <span>125 ₽</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Статус заказа</span>
                <span>Завершен</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Почта Supercell ID</span>
                <span>donatikbbs@gmail.com</span>
            </div>

            <div className="flex column">
                <span className="subtitle">Код Supercell ID</span>
                <span>559944</span>
            </div>
            <div className="bottom-0 left-0 absolute w-100 flex">
                <div className="px-04 w-100 py-04">
                    <Button style={{color: "red !important"}} className="w-100 text__center" type="checkout"
                            title="Оставить отзыв"></Button>
                </div>
            </div>
        </div>
    </div>
}

export default OrderDetails;