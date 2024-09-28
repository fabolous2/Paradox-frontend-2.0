import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOneTransaction } from "../../db/db";
import { useTelegram } from "../../hooks/useTelegram";
import { CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PaymentProcessing() {
    const navigate = useNavigate()
    const { order_id } = useParams()
    const [transaction, setTransaction] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState('pending')
    const [timeLeft, setTimeLeft] = useState(600)
    const { tg } = useTelegram();

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
        const fetchTransaction = async () => {
            const response = await getOneTransaction(order_id, tg.initData)
            setTransaction(response)
        }
        fetchTransaction()

        const checkPaymentStatus = async () => {
            const updatedTransaction = await getOneTransaction(order_id, tg.initData)
            if (updatedTransaction.is_successful) {
                setPaymentStatus('success')
            }
        }

        const statusInterval = setInterval(checkPaymentStatus, 5000) // Check every 5 seconds

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer)
                    clearInterval(statusInterval)
                    setPaymentStatus('failed')
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => {
            clearInterval(statusInterval)
            clearInterval(timer)
        }
    }, [order_id])

    useEffect(() => {
        if (paymentStatus === 'pending') {
            tg.MainButton.setParams({
                text: 'Перейти к оплате',
                color: tg.themeParams.button_color,
            });
            tg.MainButton.onClick(() => {
                if (transaction && transaction.payment_data && transaction.payment_data.url) {
                    tg.openLink(transaction.payment_data.url);
                } else {
                    console.error('Payment URL not available');
                }
            });
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }

        return () => {
            tg.MainButton.offClick();
            tg.MainButton.hide();
        };
    }, [transaction, paymentStatus]);

    const renderContent = () => {
        switch (paymentStatus) {
            case 'success':
                return (
                    <>
                        <CheckCircleOutlineIcon style={{ fontSize: 60, color: 'green' }} />
                        <p style={{textAlign: 'center', marginBottom: '2rem'}}>Оплата прошла успешно!</p>
                    </>
                );
            case 'failed':
                return (
                    <>
                        <CancelIcon style={{ fontSize: 60, color: 'red' }} />
                        <p style={{textAlign: 'center', marginBottom: '2rem'}}>Оплата не удалась. Попробуйте еще раз.</p>
                    </>
                );
            default:
                return (
                    <>
                        <CircularProgress size={60} />
                        <p style={{textAlign: 'center', marginBottom: '2rem'}}>Ожидаем оплату... {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                    </>
                );
        }
    }

    return (
        <div style={{
            backgroundColor: tg.themeParams.bg_color,
            color: tg.themeParams.text_color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '1rem'
        }}>
            <div style={{width: '100%', maxWidth: '300px'}}>
                <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {renderContent()}
                </div>
                <button 
                    style={{
                        width: '100%',
                        backgroundColor: tg.themeParams.button_color,
                        color: tg.themeParams.button_text_color,
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        marginBottom: '1rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate("/profile")}
                >
                    Вернуться в профиль
                </button>
            </div>
        </div>
    )
}