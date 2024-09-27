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
                if (dbUser && response) {
                    const requiredAmount = Math.max(response.price - dbUser.balance, 0)
                    setAmount(requiredAmount.toString())
                }
            } catch (error) {
                console.error("Error fetching product:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId, dbUser])

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

    if (!productId) {
        return (
          <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)'}}>
            <p>Ошибка: ID товара не определен</p>
          </div>
        );
    }

    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Пополнить баланс</h3>
        </div>
        <div className="flex column horizontal-padding gap-1">
            <div className="error-message">
                <h2>Ой!</h2>
                <p>❌ Недостаточно средств на балансе!</p>
                <p>Ваш баланс: {dbUser.balance} ₽</p>
                {product && <p>Необходимо пополнить баланс на {Math.max(product.price - dbUser.balance, 0)} ₽</p>}
            </div>
            <label htmlFor="amount" className="subtitle">Введите сумму в рублях</label>
            <div className="flex column">
                <input 
                    id="amount" 
                    value={amount} 
                    onChange={handleChangeAmount} 
                    name="amount" 
                    placeholder="Сумма"
                    className={`input-text ${validStatus === 1 ? 'input-valid' : ''} ${validStatus === -1 ? 'input-invalid' : ''}`}
                    type="number" 
                    min={10} 
                    max={50000}
                />
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
            <div className="flex column gap-2">
                <h3>Выберите способ оплаты</h3>
                <div className="flex gap-1 align-items-center">
                    <input checked={method === 'card'} id="card" name="type" type="radio" onChange={() => setMethod('card')}/>
                    <label htmlFor="card">Картой (Kassa)</label>
                </div>
                <div className="flex gap-1 align-items-center">
                    <input id="sbp" name="type" type="radio" onChange={() => setMethod('sbp')}/>
                    <label htmlFor="sbp">СБП (Kassa)</label>
                </div>
            </div>
        </div>
    </div>
};

export default DeficiencyDeposit;