import React, {useState} from 'react';
import './Deposit.css'
import Button from "../../Components/Button";

function Deposit() {
    const [amount, setAmount] = useState('');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
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
        console.log(e.target.value);
    }

    const onSubmit = () => {
        if (amount < 1 || !amount) {
            setValidStatus(-1);
            setMessage('Введите сумму')
        }
    }
    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Пополнить баланс</h3>
        </div>
        <div className="flex column horizontal-padding gap-1">
            <label htmlFor="amout" className="subtitle">Введите сумму в рублях</label>
            <div className="flex column">
                <input id="amout" value={amount} onChange={onChange} name="amout" placeholder="Сумма"
                       className={`input-text ${validStatus === 1 && 'input-valid'} ${validStatus === -1 && 'input-invalid'}`}
                       type="number" min={10} max={50000}/>
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
            <div className="flex column gap-2">
                <h3>Выберите способ оплаты</h3>
                <div className="flex gap-1 align-items-center">
                    <input checked={true} id="card" name="type" type="radio"/>
                    <label htmlFor="card">Картой (Kassa)</label>
                </div>
                <div className="flex gap-1 align-items-center">
                    <input id="sbp" name="type" type="radio"/>
                    <label htmlFor="sbp">СБП (Kassa)</label>
                </div>
            </div>

        </div>
        <div className="bottom-0 left-0 absolute w-100 flex">
            <div className="px-04 w-100 py-04">
                <Button onClick={onSubmit} style={{color: "red !important"}} className="w-100 text__center"
                        type="checkout"
                        title="Оплатить"></Button>
            </div>
        </div>
    </div>
}

export default Deposit;