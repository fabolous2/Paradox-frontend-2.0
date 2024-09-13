import React, {useState} from 'react';
import './TabScreen.css';
import {motion} from "framer-motion";
import Lock from '../../images/lock.png';
import Card from '../../images/credit-card-arrow-right.svg';
import Check from '../../images/check.png';
import ArrowGreater from '../../images/arrow_greater.png';
import Deposit from '../../images/deposit.png';
import Payment from '../../images/payment.png';
import {useNavigate} from "react-router-dom";

let tabs = [
    {id: 1, label: "Заказы"},
    {id: 2, label: "Транзакции"},
];

function TabScreen() {
    const theme = window.Telegram.WebApp.colorScheme;
    const navigate = useNavigate();
    let [activeTab, setActiveTab] = useState(tabs[0].id);
    return <div className='horizontal-padding'>
        <div className='flex relative gap-1 bg-gray text-white rounded'>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${activeTab === tab.id ? 'active-tab' : ''} btn-tab relative rounded transition`}
                    style={{
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {activeTab === tab.id && (
                        <motion.span
                            layoutId="bubble"
                            className="absolute rounded inset-0 z-10 bg-lightgray mix-blend-difference"

                            transition={{type: "spring", bounce: 0.2, duration: 0.6}}
                        />
                    )}
                    {tab.label}
                </button>
            ))}
        </div>
        {activeTab === 1 &&
            <div className="flex column gap-05 mt-05">

                <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                    <div className="icon-container">
                        <img className="icon"
                             style={{filter: "invert(22%) sepia(82%) saturate(6643%) hue-rotate(145deg) brightness(99%) contrast(93%)"}}
                             src={Card} alt=""/>
                    </div>
                    <div className="flex column">
                        <small className="fw-500">80 гемов</small>
                        <small>Оплачен</small>
                    </div>
                    <div className="ms-auto flex gap-05 align-items-center">
                        <small>125 ₽</small>
                        <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                    </div>
                </div>

                <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                    <div className="icon-container">
                        <img className="icon" src={Lock} alt=""/>
                    </div>
                    <div className="flex column">
                        <small className="fw-500">80 гемов</small>
                        <small>Закрыт</small>
                    </div>
                    <div className="ms-auto flex gap-05 align-items-center">
                        <small>125 ₽</small>
                        <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                    </div>
                </div>

                <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                    <div className="icon-container">
                        <img className="icon" src={Check} alt=""/>
                    </div>
                    <div className="flex column">
                        <small className="fw-500">80 гемов</small>
                        <small>Завершен</small>
                    </div>
                    <div className="ms-auto flex gap-05 align-items-center">
                        <small>125 ₽</small>
                        <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                    </div>
                </div>

            </div>
        }
        {activeTab === 2 &&
            <div className="flex column gap-05 mt-05">

                <div className="bg-gray rounded py-04 px-08 flex align-items-center">
                    <div className="icon-container">
                        <img className="icon"
                             style={{filter: "invert(22%) sepia(82%) saturate(6643%) hue-rotate(145deg) brightness(99%) contrast(93%)"}}
                             src={Deposit} alt=""/>
                    </div>
                    <div className="flex column">
                        <small className="fw-500">Карта</small>
                        <small>Пополнение</small>
                    </div>
                    <div className="ms-auto flex gap-05 align-items-center">
                        <small>+ 1000 ₽</small>
                    </div>
                </div>

                <div className="bg-gray rounded py-04 px-08 flex align-items-center">
                    <div className="icon-container">
                        <img className="icon"
                             src={Payment} alt=""/>
                    </div>
                    <div className="flex column">
                        <small className="fw-500">Карта</small>
                        <small>Оплата</small>
                    </div>
                    <div className="ms-auto flex gap-05 align-items-center">
                        <small>+ 1000 ₽</small>
                    </div>
                </div>

            </div>
        }

    </div>
}

export default TabScreen;