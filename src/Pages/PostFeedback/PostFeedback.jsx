import React, { useState, useEffect, useCallback } from 'react';
import './PostFeedback.css';
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
    tg.BackButton.onClick(() => navigate(-1));

    return () => {
      tg.BackButton.offClick(() => navigate(-1));
      tg.BackButton.hide();
    };
  }, [tg.BackButton, navigate]);

  const handleSubmit = useCallback(async () => {
    const currentReview = review.trim();
    if (currentReview === '') {
      setError('Пожалуйста, введите текст отзыва');
      return;
    }
    setError('');
    try {
      const is_posted = await isUserPostedFeedback(product.id, tg.initData);
      if (is_posted) {
        setError('Вы уже оставили отзыв на этот товар');
      } else {
        await postFeedback(product.id, rating, currentReview, tg.initData);
        navigate('/');
      }
    } catch (err) {
      setError('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.');
    }
  }, [review, product, rating, tg.initData, navigate]);

  useEffect(() => {
    const setupMainButton = () => {
      tg.MainButton.setParams({
        text: 'Отправить',
        color: '#4CAF50',
      });
      tg.MainButton.onClick(handleSubmit);
      tg.MainButton.show();
    };

    setupMainButton();

    return () => {
      tg.MainButton.offClick(handleSubmit);
      tg.MainButton.hide();
    };
  }, [tg.MainButton, handleSubmit]);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getOneProduct(id);
      setProduct(product);
    };
    fetchProduct();
  }, [id]);

  if (!product) return (
    <div className="loading-container">
      <CircularProgress />
    </div>
  );

  return (
    <div className="post-feedback-container">
      <h2 className="feedback-title">Оставить отзыв</h2>
      <div className="product-info">
        <img src={product.image_url} alt={product.name} className="product-image" />
        <div className="product-details">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{product.price} ₽</p>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="feedback-form">
        <div className="rating-container">
          <p className="rating-label">Рейтинг</p>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="review-container">
          <label htmlFor="review" className="review-label">Текст отзыва</label>
          <textarea
            id="review"
            className={`review-textarea ${error ? 'error' : ''}`}
            placeholder="Введите текст..."
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
              if (error) setError('');
              tg.MainButton.show();
            }}
            onFocus={() => tg.MainButton.hide()}
            onBlur={() => tg.MainButton.show()}
            maxLength={500}
          ></textarea>
          <p className="character-count">{review.length}/500 символов</p>
        </div>
      </div>
    </div>
  );
};

export default PostFeedback;