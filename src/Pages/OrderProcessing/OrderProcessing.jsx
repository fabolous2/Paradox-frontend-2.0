import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainButton } from '@vkruglikov/react-telegram-web-app';
import { getOneProduct, sendOrder } from '../../db/db';

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [pubg_id, setPubgId] = useState('');
  const [blockman_id, setBlockmanId] = useState('');
  const [nickname, setNickname] = useState('');
  const [login, setLogin] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(id);
        const fetchedProduct = await getOneProduct(id);
        console.log(fetchedProduct);
        setProduct(fetchedProduct);

        switch(fetchedProduct.game_id) {
          case 1:
          case 2:
          case 3:
          case 4:
            setFormFields(['email', 'code']);
            break;
          case 5:
            setFormFields(['username', 'password', 'twoFactorCode']);
            break;
          case 6:
          case 10:
            setFormFields(['nickname']);
            break;
          case 7:
            setFormFields(['pubg_id']);
            break;
          case 8:
          case 9:
          case 11:
          case 12:
          case 14:
            setFormFields(['email', 'password']);
            break;
          case 13:
            setFormFields(['blockman_id', 'password']);
            break;
          default:
            setFormFields(['login', 'password']);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      setEmailError('Пожалуйста, заполните поле email');
      setCodeSuccess('');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Такой почты не существует');
      setCodeSuccess('');
    } else {
      setEmailError('');
      setCodeSuccess('Код был успешно отправлен');
      // Здесь должна быть логика отправки кода
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    formFields.forEach(field => {
      if (!eval(field)) {
        errors[field] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      let additionalData = {};
      switch(product.game_id) {
        case 1:
        case 2:
        case 3:
        case 4:
          additionalData = { email, code };
          break;
        case 5:
          additionalData = { login: username, password, two_factor_code: twoFactorCode };
          break;
        case 6:
        case 10:
        case 12:
          additionalData = { nickname };
          break;
        case 7:
          additionalData = { pubg_id };
          break;
        case 8:
        case 9:
        case 11:
        case 14:
          additionalData = { login: email, password };
          break;
        case 13:
          additionalData = { blockman_id, password };
          break;
        default:
          additionalData = { login, password };
      }
      await sendOrder({ productId: id, additionalData });
      navigate('/order/success');
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Произошла ошибка при отправке заказа');
    }
  };


  const renderFormFields = () => {
    return formFields.map((field) => {
      const commonInputStyle = {
        width: '100%',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        color: 'var(--tg-theme-text-color)',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)',
        boxSizing: 'border-box',
        maxWidth: '100%',
        border: 'none',
        borderBottom: '1px solid var(--tg-theme-hint-color)',
        outline: 'none'
      };
      
      switch(field) {
        case 'email':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
                {product.game_id === 8 ? 'Почта от Facebook' :
                 product.game_id === 9 ? 'Почта от XBOX Live' :
                 product.game_id === 11 ? 'Почта' :
                 product.game_id === 12 ? 'Почта' :
                 product.game_id === 14 ? 'Почта' : 'Почта Supercell ID'}
              </label>
              <div style={{display: 'flex'}}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...commonInputStyle,
                    flexGrow: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottom: formErrors.email ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                  }}
                  placeholder="Введите email"
                />
                {(product.game_id === 8 || product.game_id === 14) && (
                  <button
                    onClick={handleEmailSubmit}
                    style={{backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem', borderTopRightRadius: '0.25rem', borderBottomRightRadius: '0.25rem', border: 'none'}}
                  >
                    ➤
                  </button>
                )}
              </div>
              {emailError && <p style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem'}}>{emailError}</p>}
              {codeSuccess && <p style={{color: '#10b981', fontSize: '0.875rem', marginTop: '0.25rem'}}>{codeSuccess}</p>}
            </div>
          );
        case 'code':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>Код</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.code ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите код"
              />
            </div>
          );
        case 'username':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.username ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите имя пользователя"
              />
            </div>
          );
        case 'password':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
                {product.game_id === 8 ? 'Пароль от Facebook' :
                 product.game_id === 9 ? 'Пароль от XBOX Live' :
                 'Пароль'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.password ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите пароль"
              />
            </div>
          );
        case 'twoFactorCode':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>Код двухфакторной аутентификации</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.twoFactorCode ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите код двухфакторной аутентификации"
              />
            </div>
          );
        case 'nickname':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
                {product.game_id === 12 ? 'Ник (советую скопировать его, очень важно написать его верно)' : 'Никнейм'}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.nickname ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите никнейм"
              />
            </div>
          );
        case 'pubg_id':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
                PUBG ID
              </label>
              <input
                type="text"
                value={pubg_id}
                onChange={(e) => setPubgId(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.pubg_id ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите PUBG ID"
              />
            </div>
          );
        case 'blockman_id':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>
                Ваш ID
              </label>
              <input
                type="text"
                value={blockman_id}
                onChange={(e) => setBlockmanId(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.blockman_id ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите ID"
              />
            </div>
          );
        case 'login':
          return (
            <div key={field} style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem'}}>Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                style={{
                  ...commonInputStyle,
                  borderBottom: formErrors.login ? '1px solid red' : '1px solid var(--tg-theme-hint-color)'
                }}
                placeholder="Введите логин"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)'}}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '1rem', backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)'}}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Оформление заказа</h1>
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
      {product.instruction && product.instruction.trim() !== '' && (
        <span className="bg-lightgray rounded px-08 word-pre py-08" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
          {product.instruction}
        </span>
      )}
        {renderFormFields()}
      </div>
      <MainButton text="Продолжить" onClick={handleSubmit} />
    </div>
  );
};

export default OrderForm;