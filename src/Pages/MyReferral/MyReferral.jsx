import React, {useState, useEffect} from 'react';
import './MyReferral.css'
import Button from "../../Components/Button";
import { getUser, checkCodeAvailability, setReferralCode } from '../../db/db';

function MyReferral() {
    const [code, setCode] = useState('');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const [btnMessage, setBtnMessage] = useState('Копировать ссылку');
    const [link, setLink] = useState(`https://t.me/paradox_bot?start=${code}`);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser();
            setUser(response);
            setCode(response.referral_code);
            setLink(`https://t.me/paradox_bot?start=${response.referral_code}`);
        };
        fetchUser();
    }, []);
    const onChange = (e) => {
        const newCode = e.target.value;
        const allowedChars = /^[a-zA-Z0-9]*$/;
        if (!allowedChars.test(newCode)) {
            setValidStatus(-1);
            setMessage('Разрешены только английские буквы и цифры');
            return;
        }
        setCode(newCode);
        
        const checkAvailability = async () => {
            const response = await checkCodeAvailability(newCode);
            if (response) {
                if (newCode === user.referral_code) {
                    setValidStatus(0);
                    setMessage('');
                } else {
                    setValidStatus(1);
                    setMessage('Реферальный код доступен');
                }
            } else {
                if (newCode !== user.referral_code) {
                    setValidStatus(-1);
                    setMessage('Реферальный код уже занят другим пользователем');
                } else {
                    setValidStatus(0);
                    setMessage('');
                }
            }
        }
        
        checkAvailability();
    }

    const onSubmit = async () => {
        setLink(`https://t.me/paradox_bot?start=${code}`);
        try {
            if (code !== user.referral_code) {  
                await setReferralCode(code);
                setValidStatus(1);
                setMessage('Готово!');
                setUser(prevUser => ({...prevUser, referral_code: code}));
            } else {
                setValidStatus(-1);
                setMessage('Реферальный код уже занят вами');
            }
        } catch (error) {
            setValidStatus(-1);
            setMessage('Ошибка при установке реферального кода');
        }
    }

    const onCopy = (text) => {
        navigator.clipboard.writeText(text);
        setBtnMessage('Ссылка скопирована')
    }

    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Реферальная программа</h3>
        </div>
        <div className="flex column horizontal-padding gap-1">
            <div className="label">Ваш реферальный код:</div>
            <div className="flex column">
                <input id="code" value={code} onChange={onChange} name="code" placeholder={code}
                       className={`input-text ${validStatus === 1 && 'input-valid'} ${validStatus === -1 && 'input-invalid'}`}
                       type="text"/>
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
        </div>
        <div className="horizontal-padding flex column">
            <div className="label">Распространяйте ваше реферальную ссылку, и за
                каждого нового пользователя по вашей ссылке
                вы будете получать процент с каждой его покупки на баланс.
            </div>

            <span className="fw-500">Ваша реферальная ссылка:</span>
            <p className="text-wrap"><code>
                <mark>{link}</mark>
            </code></p>
            <Button onClick={() => {
                onCopy(link)
            }} style={{color: "red !important"}} className="w-100 text__center"
                    type="secondary"
                    title={btnMessage}></Button>
        </div>
        <div className="bottom-0 left-0 absolute w-100 flex">
            <div className="px-04 w-100 py-04">
                <Button onClick={onSubmit} style={{color: "red !important"}} className="w-100 text__center"
                        type="checkout"
                        title="Сохранить"></Button>
            </div>
        </div>
    </div>
}

export default MyReferral;