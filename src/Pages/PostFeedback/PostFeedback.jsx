import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postFeedback, getOneProduct, isUserPostedFeedback } from '../../db/db';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import CircularProgress from '@mui/material/CircularProgress';

const PostFeedback = () => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
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
    tg.MainButton.setParams({
      text: 'Отправить',
      color: '#4CAF50',
    });
    tg.MainButton.onClick(handleSubmit);
    tg.MainButton.show();

    return () => {
      tg.MainButton.offClick(handleSubmit);
      tg.MainButton.hide();
    };
  }, []);

  const handleSubmit = async () => {
    if (review.trim() === '') {
      setError('Пожалуйста, введите текст отзыва');
      return;
    }
    setError(''); // Clear any previous error
    const is_posted = await isUserPostedFeedback(product.id, tg.initData);
    if (is_posted) {
      setError('Вы уже оставили отзыв на этот товар');
    } else {
      try {
        await postFeedback(product.id, rating, review, tg.initData);
        navigate('/');
      } catch (err) {
        setError('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getOneProduct(id);
      setProduct(product);
    };
    fetchProduct();
  }, [id]);

  if (!product) return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--tg-theme-bg-color)',
      color: 'var(--tg-theme-text-color)'
    }}>
      <CircularProgress />
    </div>
  );

  return (
    <div style={{
      padding: '1rem',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--tg-theme-bg-color)',
      color: 'var(--tg-theme-text-color)',
      overflow: 'hidden'
    }}>
      <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem'}}>Оставить отзыв</h2>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'var(--tg-theme-secondary-bg-color)'
      }}>
        <img src={product.image_url} alt={product.name} style={{
          width: '4rem',
          height: '4rem',
          marginRight: '1rem',
          borderRadius: '0.25rem',
          objectFit: 'cover'
        }} />
        <div>
          <p style={{fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem'}}>{product.name}</p>
          <p style={{fontSize: '0.875rem', fontWeight: '500', color: 'var(--tg-theme-button-color)'}}>{product.price} ₽</p>
        </div>
      </div>
      {error && <p style={{color: '#ef4444', marginBottom: '0.5rem', fontSize: '0.875rem'}}>{error}</p>}
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{marginBottom: '0.5rem'}}>
          <p style={{marginBottom: '0.25rem', color: 'var(--tg-theme-hint-color)', fontSize: '0.875rem'}}>Рейтинг</p>
          <div style={{display: 'flex'}}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: star <= rating ? '#fbbf24' : 'var(--tg-theme-hint-color)',
                  background: 'none',
                  border: 'none',
                  padding: '0',
                  marginRight: '0.25rem',
                  cursor: 'pointer'
                }}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="review" style={{display: 'block', marginBottom: '0.25rem', color: 'var(--tg-theme-hint-color)', fontSize: '0.875rem'}}>Текст отзыва</label>
          <textarea
            id="review"
            style={{
              width: '100%',
              flexGrow: 1,
              border: error ? '1px solid #ef4444' : '1px solid var(--tg-theme-hint-color)',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              resize: 'none',
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              boxSizing: 'border-box',
              fontSize: '0.875rem'
            }}
            placeholder="Введите текст..."
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              if (error) setError('');
            }}
            maxLength={500}
          ></textarea>
          <p style={{fontSize: '0.75rem', color: 'var(--tg-theme-hint-color)', marginTop: '0.25rem'}}>{review.length}/500 символов</p>
        </div>
      </div>
    </div>
  );
};

export default PostFeedback;