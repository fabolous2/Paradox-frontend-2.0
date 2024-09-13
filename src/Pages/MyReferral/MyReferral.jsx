import React, {useState} from 'react';
import './MyReferral.css'
import Button from "../../Components/Button";

function MyReferral() {
    const [code, setCode] = useState('12345675123');
    const [validStatus, setValidStatus] = useState(0);
    const [message, setMessage] = useState('');
    const [btnMessage, setBtnMessage] = useState('Копировать ссылку');
    const [link, setLink] = useState(`https://t.me/HoldikGem_bot?start=${code}`);
    const [data, setData] = useState("");
    const colorScheme = window.Telegram.WebApp.colorScheme;
    window.Telegram.WebApp.onEvent('web_app_ready', () => {
        const initData = window.Telegram.WebApp.initData;
        setData(initData); // You should see the InitData in the console
        console.log(initData);
    });
    console.log(window.Telegram.WebApp);

    const onChange = (e) => {
        setValidStatus(-1);
        setMessage('Реферальный код уже занят другим пользователем')
        setCode(e.target.value)
        console.log(e.target.value);
    }

    const onSubmit = () => {
        setLink(`https://t.me/HoldikGem_bot?start=${code}`);
        setValidStatus(1);
        setMessage('Готово!')
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
            <label htmlFor="code" className="subtitle">Ваш реферальный код</label>
            <div className="flex column">
                <input id="code" value={code} onChange={onChange} name="code" placeholder={code}
                       className={`input-text ${validStatus === 1 && 'input-valid'} ${validStatus === -1 && 'input-invalid'}`}
                       type="text"/>
                <small className={`${validStatus === 1 ? 'text-valid' : 'text-invalid'}`}>{message}</small>
            </div>
        </div>
        <div className="horizontal-padding flex column">
            <p className="subtitle">Распространяйте ваше реферальную ссылку, и за
                каждого нового пользователя по вашей ссылке
                вы будете получать процент с каждой его покупки на баланс.
            </p>

            <span className="fw-500">Ваша реферальная ссылка:</span>
            <p className="text-wrap"><code>
                <mark>{link}</mark>
            </code></p>
            <p className="text-wrap"><code>
                <mark>{JSON.stringify(data)}</mark>
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
                        title="Применить промокод"></Button>
            </div>
        </div>
    </div>
}

export default MyReferral;