import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { getOneOrder, getOneProduct } from '../../db/db';
import { useNavigate } from 'react-router-dom';
import { MainButton } from '@vkruglikov/react-telegram-web-app';

function OrderDetails() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const orderData = await getOneOrder(id);
            const productData = await getOneProduct(orderData.product_id);
            setOrder(orderData);
            setProduct(productData);
            setLoading(false);
        }
        fetchData();
    }, [id]);

    const handleLeaveFeedback = () => {
        navigate(`/post-feedback/${product.id}`);
    };

    return (
        <div className="transaction-detail">
            <h2 className="text-2xl font-bold mb-4">Информация о заказе</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="detail-item">
                        <div className="label">ID заказа</div>
                        <div className="value">{order.id}</div>
                    </div>
                    
                    <div className="detail-item">
                        <div className="label">Дата и время заказа</div>
                        <div className="value">
                            {new Date(order.time).toLocaleString('ru-RU', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                hour12: false 
                            }).replace(/[,/]/g, '.').replace(' ', ' ')}
                        </div>
                    </div>
                    
                    <div className="detail-item">
                        <div className="label">Товар</div>
                        <div className="value">{product.name}</div>
                    </div>

                    <div className="detail-item">
                        <div className="label">ID товара</div>
                        <div className="value">{product.id}</div>
                    </div>
                    
                    <div className="detail-item">
                        <div className="label">Стоимость</div>
                        <div className="value">{order.price}</div>
                    </div>

                    <div className="detail-item">
                        <div className="label">Статус заказа</div>
                        <div className="value">
                            {order.status === "paid" ? "Оплачено" : 
                            order.status === "closed" ? "Закрыт" :
                            order.status === "completed" ? "Выполнен" :
                            order.status === "progress" ? "В обработке" :
                            null}
                        </div>
                    </div>
                            
                    <div className="detail-item">
                        <div className="label">Почта Supercell ID</div>
                        <div className="value">{order.additional_data.email}</div>
                    </div>

                    <div className="detail-item">
                        <div className="label">Код Supercell ID</div>
                        <div className="value">{order.additional_data.code}</div>
                    </div>
                
                    {order.status === "completed" && (
                        <MainButton 
                            text="Оставить отзыв"
                            onClick={handleLeaveFeedback}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default OrderDetails;