import React, {useState} from 'react';
import './PromoCode.css'
import Button from "../../Components/Button";

function PromoCode() {
    const [code, setCode] = useState('');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setValidStatus(-1);
        setMessage('Неверный промокод, попробуйте ещё раз')
        setCode(e.target.value)
        console.log(e.target.value);
    }

    const onSubmit = () => {
        setValidStatus(1);
        setMessage('Промокод успешно применён')
    }
    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Ввести промокод</h3>
        </div>
        <div className="flex column horizontal-padding gap-1">
            <label htmlFor="code" className="subtitle">Введите промокод</label>
            <div className="flex column">
                <input id="code" value={code} onChange={onChange} name="code" placeholder="Промокод"
                       className={`input-text ${validStatus === 1 && 'input-valid'} ${validStatus === -1 && 'input-invalid'}`}
                       type="text"/>
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
        </div>
        <div className="bottom-0 left-0 absolute w-100 flex">
            <div className="px-04 w-100 py-04">
                <Button onClick={onSubmit} style={{color: "red !important"}} className="w-100 text__center" type="checkout"
                        title="Применить промокод"></Button>
            </div>
        </div>
    </div>
}

export default PromoCode;