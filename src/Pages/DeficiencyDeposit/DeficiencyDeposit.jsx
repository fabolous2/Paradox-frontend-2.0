import React, { useState, useEffect } from 'react';
import { getOneProduct } from '../../db/db';
import { useParams } from 'react-router-dom';

const DeficiencyDeposit = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [method, setMethod] = useState('card');
    const [amount, setAmount] = useState(0);
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        console.log("productId", productId)
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
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' }}>
                <div className="text-2xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)', height: '100vh' }}>
            <div className="flex-grow flex flex-col p-4">
                <div className="w-full h-full flex flex-col">
                    <div className="bg-gray-800 p-4 rounded-lg flex-grow flex flex-col" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h1 className="text-xl font-bold mb-2">Ой!</h1>
                                <div className="bg-gray-700 p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--tg-theme-hint-color)' }}>
                                    <p className="text-red-500 mb-2">❌ Недостаточно средств на балансе!</p>
                                    <p>Ваш баланс: 20 ₽!</p>
                                    {product && <p>Необходимо пополнить баланс на {product.price - 20} ₽</p>}
                                </div>
                                <div className="flex column horizontal-padding gap-1">
                                    <label htmlFor="amount" className="subtitle">Введите сумму в рублях</label>
                                    <div className="flex column">
                                        <input id="amount" value={amount} onChange={handleChangeAmount} name="amount" placeholder="Сумма"
                                            className={`input-text ${validStatus === 1 && 'input-valid'} ${validStatus === -1 && 'input-invalid'}`}
                                            type="number" min={10} max={50000}/>
                                        <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
                                    </div>
                                    <div className="mt-auto">
                                        <h3 className="mb-2">Выберите способ оплаты</h3>
                                        <div className="flex gap-1 align-items-center mb-2">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeficiencyDeposit;