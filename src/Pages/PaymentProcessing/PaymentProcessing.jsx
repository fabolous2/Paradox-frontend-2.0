import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { getOneTransaction } from "../../db/db";

export default function PaymentProcessing() {
    const navigate = useNavigate()
    const { order_id } = useParams()
    const [transaction, setTransaction] = useState(null)

    useEffect(() => {
        const fetchTransaction = async () => {
            const response = await getOneTransaction(order_id)
            setTransaction(response)
        }
        fetchTransaction()
    }, [order_id])

    return <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
    <div className="w-full max-w-sm">
      <div className="mb-8 flex justify-center">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
      <p className="text-center text-gray-600 mb-8">Ожидаем оплату...</p>
      <button 
        className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-full mb-4 hover:bg-blue-600 transition duration-300"
        onClick={() => {
            console.log("transaction", transaction)
          if (transaction && transaction.payment_data && transaction.payment_data.url) {
            window.location.href = transaction.payment_data.url;
          } else {
            console.error('Payment URL not available');
          }
        }}
      >
        Перейти к оплате
      </button>
      <button className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-full hover:bg-gray-300 transition duration-300" onClick={() => navigate("/profile")}>
        Вернуться в профиль
      </button>
    </div>
    </div>
}