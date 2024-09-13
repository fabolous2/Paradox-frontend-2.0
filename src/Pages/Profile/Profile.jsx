import React, {useEffect, useState} from 'react';
import './Profile.css'
import avatar from '../../images/avatar.jpg';
import Button from "../../Components/Button";
import arrowGreater from '../../images/arrow_greater.png';
import TabScreen from "../../Components/TabScreen/TabScreen";
import {useNavigate} from "react-router-dom";
import {useTelegram} from '../../hooks/useTelegram';
import {getUser} from '../../db/db';

function Profile() {
    const navigate = useNavigate();
    const {tg, user} = useTelegram();
    const [db_user, setDbUser] = useState(null);

    useEffect(() => {
        getUser(tg).then(r => setDbUser(r));
    }, [tg]);

    useEffect(() => {
        if (db_user) {
            console.log('User db data:', db_user);
        }
    }, [db_user]);

    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Профиль</h3>
        </div>
        <div className="flex horizontal-padding vertical-padding">
            <img className="avatar" src={avatar} alt=""/>
            <div className="flex column justify-center horizontal-padding">
                <b>{user?.first_name} {user?.last_name}</b>
                <span>{user?.username}</span>
            </div>
        </div>
        <div className="flex horizontal-padding justify-between">
            <h3>Баланс: {db_user.balance} ₽</h3>
            <span className="text-blue pointer" onClick={() => navigate('/deposit')}>Пополнить</span>
        </div>
        <div className="flex column horizontal-padding vertical-padding gap-1">
            <Button onClick={() => {navigate('/my-referral')}} className="px-08" type='info' image={arrowGreater} image_invert={true} title='Реферальная система'></Button>
            <Button onClick={() => {navigate('/promo-code')}} className="px-08" type='info' image={arrowGreater} image_invert={true} title='Ввести промокод'></Button>
        </div>

        <TabScreen/>
    </div>
}

export default Profile;