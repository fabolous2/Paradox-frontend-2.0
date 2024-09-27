import React, { useState, useEffect } from 'react';
import { getOneProduct, getUser } from '../../db/db';
import { useParams } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';

const DeficiencyDeposit = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [method, setMethod] = useState('card');
    const [amount, setAmount] = useState('');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const [dbUser, setDbUser] = useState(null)
    const { tg } = useTelegram();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUser(tg.initData)
                setDbUser(response)
            } catch (error) {
                console.error("Error fetching user:", error)
            }
        }
        fetchUser()
    }, [])
 
    useEffect(() => {
      tg.BackButton.show();
      tg.BackButton.onClick(() => {
        window.history.back();
      });
  
      return () => {
        tg.BackButton.offClick();
        tg.BackButton.hide();
      };
    }, []);
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getOneProduct(productId)
                setProduct(response)
            } catch (error) {
                console.error("Error fetching product:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId])

    const handleChangeAmount = (e) => {
        let val = parseInt(e.target.value);
        if (val < 10) {
            setValidStatus(-1);
            setMessage('Минимальная сумма - 10 руб!')
        } else if (val > 50000) {
            setValidStatus(-1);
            setMessage('Максимальная сумма - 50000 руб!')
        } else {
            setValidStatus(0);
            setMessage('')
        }
        setAmount(e.target.value)
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Loading...</div>
            </div>
        )
    }

    return (
        <div className="deficiency-deposit">
            <div className="content">
                <div className="card">
                    <h1 className="title">Ой!</h1>
                    <div className="error-message">
                        <p>❌ Недостаточно средств на балансе!</p>
                        <p>Ваш баланс: {dbUser.balance} ₽!</p>
                        {product && <p>Необходимо пополнить баланс на {product.price - dbUser.balance} ₽</p>}
                    </div>
                    <div className="form">
                        <label htmlFor="amount" className="subtitle">Введите сумму в рублях</label>
                        <div className="input-container">
                            <input 
                                id="amount" 
                                value={amount || (product ? product.price - dbUser.balance : '')} 
                                onChange={handleChangeAmount} 
                                name="amount" 
                                placeholder="Сумма"
                                className={`input-text ${validStatus === 1 ? 'input-valid' : ''} ${validStatus === -1 ? 'input-invalid' : ''}`}
                                type="number" 
                                min={10} 
                                max={50000}
                            />
                            <small className={validStatus === 1 ? 'text-valid' : 'text-invalid'}>{message}</small>
                        </div>
                        <div className="payment-method">
                            <h3>Выберите способ оплаты</h3>
                            <div className="radio-group">
                                <input checked={method === 'card'} id="card" name="type" type="radio" onChange={() => setMethod('card')}/>
                                <label htmlFor="card">Картой (Kassa)</label>
                            </div>
                            <div className="radio-group">
                                <input id="sbp" name="type" type="radio" onChange={() => setMethod('sbp')}/>
                                <label htmlFor="sbp">СБП (Kassa)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeficiencyDeposit;