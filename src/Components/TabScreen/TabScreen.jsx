import React, {useState, useEffect} from 'react';
import './TabScreen.css';
import {motion} from "framer-motion";
import Lock from '../../images/lock.png';
import Card from '../../images/credit-card-arrow-right.svg';
import Check from '../../images/check.png';
import ArrowGreater from '../../images/arrow_greater.png';
import Deposit from '../../images/deposit.png';
import Payment from '../../images/payment.png';
import {useNavigate} from "react-router-dom";
import {getOrders, getTransactions} from '../../db/db';
import {useTelegram} from '../../hooks/useTelegram';

let tabs = [
    {id: 1, label: "Заказы"},
    {id: 2, label: "Транзакции"},
];

function TabScreen() {
    const theme = window.Telegram.WebApp.colorScheme;
    const navigate = useNavigate();
    let [activeTab, setActiveTab] = useState(tabs[0].id);
    const [transactions, setTransactions] = useState([]);
    const [orders, setOrders] = useState([]);
    const Hourglass = "https://cdn-icons-png.flaticon.com/512/3889/3889548.png"
    const Paid = "https://cdn-icons-png.flaticon.com/512/3889/3889548.png"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await getOrders();
                setOrders(ordersData);
                const transactionsData = await getTransactions();
                setTransactions(transactionsData);

                console.log(ordersData);
                console.log(transactionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const renderOrders = () => {
        if (orders.length === 0) {
            return (
                <div className="empty-state">
                    <p>У вас пока нет заказов</p>
                </div>
            );
        }
        return orders.map((order) => (
            <div key={order.id} onClick={() => {navigate(`/orders/${order.id}`)}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                <div className="icon-container">
                    <img className="icon" src={
                        order.status === 'progress' ? Hourglass :
                        order.status === 'paid' ? Paid :
                        order.status === 'closed' ? Lock :
                        order.status === 'completed' ? Check :
                        null
                    } alt=""/>
                </div>
                <div className="flex column">
                    <small className="fw-500">{order.name}</small>
                    <small>
                        {order.status === 'progress' ? 'В обработке' :
                         order.status === 'paid' ? 'Оплачен' :
                         order.status === 'closed' ? 'Закрыт' :
                         order.status === 'completed' ? 'Выполнен' :
                         null}
                    </small>
                </div>
                <div className="ms-auto flex gap-05 align-items-center">
                    <small>{order.price} ₽</small>
                    <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                </div>
            </div>
        ));
    };

    const renderTransactions = () => {
        if (transactions.length === 0) {
            return (
                <div className="empty-state">
                    <p>У вас пока нет транзакций</p>
                </div>
            );
        }
        return transactions.map((transaction) => (
            <div key={transaction.id} onClick={() => {navigate(`/transactions?id=${transaction.id}`)}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                <div className="icon-container">
                    <img className="icon" src={transaction.type === 'Пополнение' ? Deposit : Payment} alt=""/>
                </div>
                <div className="flex column">
                    <small className="fw-500">{transaction.type === 'Пополнение' ? 'Пополнение' : 'Списание'}</small>
                    <small>{
                        transaction.cause === 'Донат' ? 'Донат' :
                        transaction.cause === 'Ввод промокода' ? 'Ввод промокода' :
                        transaction.cause === 'Реферальный бонус' ? 'Реферальный бонус' :
                        transaction.cause === 'Пополнение администратором' ? 'Пополнение администратором' :
                        transaction.cause === 'Списание администратором' ? 'Списание администратором' :
                        transaction.cause === 'Оплата заказа' ? 'Оплата заказа' :
                        transaction.cause === 'Возврат' ? 'Возврат' :
                        null
                    }</small>
                </div>
                <div className="ms-auto flex gap-05 align-items-center">
                    <small style={{ color: transaction.type === 'Пополнение' ? 'green' : 'red' }}>
                        {transaction.type === 'Пополнение' ? '+' : '-'}{transaction.amount} ₽
                    </small>
                    <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                </div>
            </div>
        ));
    };

    return (
        <div className='horizontal-padding'>
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
            <div className="flex column gap-05 mt-05">
                {activeTab === 1 ? renderOrders() : renderTransactions()}
            </div>
        </div>
    );

    //  return <div className='horizontal-padding'>
    //     <div className='flex relative gap-1 bg-gray text-white rounded'>
    //         {tabs.map((tab) => (
    //             <button
    //                 key={tab.id}
    //                 onClick={() => setActiveTab(tab.id)}
    //                 className={`${activeTab === tab.id ? 'active-tab' : ''} btn-tab relative rounded transition`}
    //                 style={{
    //                     WebkitTapHighlightColor: "transparent",
    //                 }}
    //             >
    //                 {activeTab === tab.id && (
    //                     <motion.span
    //                         layoutId="bubble"
    //                         className="absolute rounded inset-0 z-10 bg-lightgray mix-blend-difference"

    //                         transition={{type: "spring", bounce: 0.2, duration: 0.6}}
    //                     />
    //                 )}
    //                 {tab.label}
    //             </button>
    //         ))}
    //     </div>
    //     {activeTab === 1 &&
    //         <div className="flex column gap-05 mt-05">

                // <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
                //     <div className="icon-container">
                //         <img className="icon"
                //              style={{filter: "invert(22%) sepia(82%) saturate(6643%) hue-rotate(145deg) brightness(99%) contrast(93%)"}}
                //              src={Card} alt=""/>
                //     </div>
                //     <div className="flex column">
                //         <small className="fw-500">80 гемов</small>
                //         <small>Оплачен</small>
                //     </div>
                //     <div className="ms-auto flex gap-05 align-items-center">
                //         <small>125 ₽</small>
                //         <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
                //     </div>
                // </div>

    //             <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
    //                 <div className="icon-container">
    //                     <img className="icon" src={Lock} alt=""/>
    //                 </div>
    //                 <div className="flex column">
    //                     <small className="fw-500">80 гемов</small>
    //                     <small>Закрыт</small>
    //                 </div>
    //                 <div className="ms-auto flex gap-05 align-items-center">
    //                     <small>125 ₽</small>
    //                     <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
    //                 </div>
    //             </div>

    //             <div onClick={() => {navigate('/orders/1')}} className="bg-gray rounded py-04 px-08 flex align-items-center">
    //                 <div className="icon-container">
    //                     <img className="icon" src={Check} alt=""/>
    //                 </div>
    //                 <div className="flex column">
    //                     <small className="fw-500">80 гемов</small>
    //                     <small>Завершен</small>
    //                 </div>
    //                 <div className="ms-auto flex gap-05 align-items-center">
    //                     <small>125 ₽</small>
    //                     <img style={{filter: `invert(${theme === 'dark' ? "1" : "0"})`}} className="icon-md" src={ArrowGreater} alt=""/>
    //                 </div>
    //             </div>

    //         </div>
    //     }
    //     {activeTab === 2 &&
    //         <div className="flex column gap-05 mt-05">

    //             <div className="bg-gray rounded py-04 px-08 flex align-items-center">
    //                 <div className="icon-container">
    //                     <img className="icon"
    //                          style={{filter: "invert(22%) sepia(82%) saturate(6643%) hue-rotate(145deg) brightness(99%) contrast(93%)"}}
    //                          src={Deposit} alt=""/>
    //                 </div>
    //                 <div className="flex column">
    //                     <small className="fw-500">Карта</small>
    //                     <small>Пополнение</small>
    //                 </div>
    //                 <div className="ms-auto flex gap-05 align-items-center">
    //                     <small>+ 1000 ₽</small>
    //                 </div>
    //             </div>

    //             <div className="bg-gray rounded py-04 px-08 flex align-items-center">
    //                 <div className="icon-container">
    //                     <img className="icon"
    //                          src={Payment} alt=""/>
    //                 </div>
    //                 <div className="flex column">
    //                     <small className="fw-500">Карта</small>
    //                     <small>Оплата</small>
    //                 </div>
    //                 <div className="ms-auto flex gap-05 align-items-center">
    //                     <small>+ 1000 ₽</small>
    //                 </div>
    //             </div>

    //         </div>
    //     }

    // </div>
}

export default TabScreen;