import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOneTransaction } from "../../db/db";
import { useTelegram } from "../../hooks/useTelegram";

export default function PaymentProcessing() {
    const navigate = useNavigate()
    const { order_id } = useParams()
    const [transaction, setTransaction] = useState(null)
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
            const response = await getOneTransaction(order_id, tg.initDataUnsafe)
            setTransaction(response)
        }
        fetchTransaction()
    }, [order_id])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Перейти к оплате',
            color: tg.themeParams.button_color,
        });
        tg.MainButton.onClick(() => {
            if (transaction && transaction.payment_data && transaction.payment_data.url) {
                window.location.href = transaction.payment_data.url;
            } else {
                console.error('Payment URL not available');
            }
        });
        tg.MainButton.show();

        return () => {
            tg.MainButton.offClick();
            tg.MainButton.hide();
        };
    }, [transaction]);

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
                <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'center'}}>
                    <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderTop: `4px solid ${tg.themeParams.button_color}`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
                <p style={{textAlign: 'center', marginBottom: '2rem'}}>Ожидаем оплату...</p>
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