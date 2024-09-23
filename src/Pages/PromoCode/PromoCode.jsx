import React, {useState} from 'react';
import './PromoCode.css'
import Button from "../../Components/Button";
import { PromoAPI, getPromo, checkIsUsedPromo } from '../../db/db';

function PromoCode() {
    const [code, setCode] = useState('');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const [debounceTimer, setDebounceTimer] = useState(null);

    const onChange = async (e) => {
        const newCode = e.target.value;
        setCode(newCode);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        if (newCode.trim() !== '') {
            const timer = setTimeout(async () => {
                const promoResult = await getPromo(newCode);
                if (promoResult) {
                    const isUsed = await checkIsUsedPromo(newCode);
                    if (isUsed === true) {
                        setValidStatus(-1);
                        setMessage('Промокод уже был использован вами');
                    } else {
                        setValidStatus(1);
                        setMessage('');
                    }
                } else {
                    setValidStatus(-1);
                    setMessage('Неверный промокод, попробуйте ещё раз');
                }
            }, 500);

            setDebounceTimer(timer);
        } else {
            setValidStatus(0);
            setMessage('');
        }

        if (newCode === '') {
            setValidStatus(0);
            setMessage('');
        }
    }

    const onSubmit = async () => {
        console.log("OnSubmit")
        try {
            const result = await (async () => {
                console.log("api");
                const response = await PromoAPI(code);
                console.log("response", response);
                return response;
            })();
            if (result) {
                // console.log("result", result);
                setValidStatus(1);
                setMessage('Промокод успешно применён');
            } else {
                setValidStatus(-1);
                setMessage('Ошибка при применении промокода');
            }
        } catch (error) {
            setValidStatus(-1);
            setMessage('Ошибка при применении промокода');
        }
    };

    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Ввести промокод</h3>
        </div>
        <div className="flex column horizontal-padding gap-1">
            <label htmlFor="code" className="subtitle">Введите промокод</label>
            <div className="flex column">
                <input id="code" value={code} onChange={onChange} name="code" placeholder="Промокод"
                       className={`input-text ${validStatus === -1 ? 'input-invalid' : ''}`}
                       type="text"/>
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
        </div>
        {validStatus === 1 && (
            <div className="bottom-0 left-0 absolute w-100 flex">
                <div className="px-04 w-100 py-04">
                    <Button onClick={onSubmit} style={{color: "red !important"}} className="w-100 text__center" type="checkout"
                            title="Применить промокод"></Button>
                </div>
            </div>
        )}
    </div>
}

export default PromoCode;