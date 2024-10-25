import React, {useEffect, useState} from 'react';
import './Profile.css'
import Button from "../../Components/Button";
import arrowGreater from '../../images/arrow_greater.png';
import TabScreen from "../../Components/TabScreen/TabScreen";
import {useNavigate} from "react-router-dom";
import {useTelegram} from '../../hooks/useTelegram';
import {getUser, updateProfilePhoto} from '../../db/db';
import CircularProgress from '@mui/material/CircularProgress';
import profilePhoto from '../../images/feedback_photo.PNG';


function Profile() {
    const navigate = useNavigate();
    const {tg, user} = useTelegram();
    const [db_user, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);
 
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
        async function fetchUser() {
            try {
                const userData = await getUser(tg.initData);
                setDbUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [tg]);

    const handlePhotoUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    tg.showAlert('Файл слишком большой. Пожалуйста, выберите изображение размером менее 10 МБ.');
                    return;
                }
                try {
                    const updatedUser = await updateProfilePhoto(file, tg.initData);
                    setDbUser(updatedUser);
                } catch (error) {
                    console.error('Error uploading profile photo:', error);
                    tg.showAlert('Произошла ошибка при загрузке фото. Пожалуйста, попробуйте еще раз.');
                }
            }
        };
        input.click();
    };

    if (loading) {
        return (
            <div className="flex justify-center align-items-center" style={{height: '100vh'}}>
                <CircularProgress />
            </div>
        );
    }

    return <div>
        <div className="flex horizontal-padding vertical-padding">
            <h3>Профиль</h3>
        </div>
        <div className="flex horizontal-padding vertical-padding align-items-center">
            <div className="avatar-container">
                <img 
                    className="avatar" 
                    src={db_user?.profile_photo || profilePhoto} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profilePhoto;
                    }}
                    alt="Profile"
                />
                <span className="upload-photo-text" onClick={handlePhotoUpload}>Прикрепить фото</span>
            </div>
            <div className="flex column justify-center horizontal-padding">
                <b>{user?.first_name} {user?.last_name}</b>
                <span style={{ color: '#888888' }}>@{user?.username}</span>
            </div>
            <div className="flex column justify-center horizontal-padding">
                <b>{user?.first_name} {user?.last_name}</b>
                <span style={{ color: '#888888' }}>@{user?.username}</span>
            </div>
        </div>
        <div className="flex horizontal-padding justify-between">
            <h3>Баланс: {parseFloat(db_user.balance).toLocaleString('ru-RU', {maximumFractionDigits: 2})} ₽</h3>
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