import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postFeedback, getOneProduct, isUserPostedFeedback } from '../../db/db';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { MainButton } from '@vkruglikov/react-telegram-web-app';

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
  }, [review, rating]);

  const handleSubmit = async () => {
    if (review.trim() === '') {
      setError('Пожалуйста, введите текст отзыва');
      return;
    }
    const is_posted = await isUserPostedFeedback(product.id, tg.initData);
    if (is_posted) {
      setError('Вы уже оставили отзыв на этот товар');
    } else {
      await postFeedback(product.id, rating, review, tg.initData);
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getOneProduct(id);
      setProduct(product);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="p-4 w-full h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4">Оставить отзыв</h2>
      <div className="flex items-center mb-4">
        <img src={product.image_url} alt={product.name} className="w-35 h-20 mr-4 rounded object-cover" />
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm">{product.price} ₽</p>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex-grow flex flex-col">
        <div className="mb-4">
          <p className="mb-2 text-gray-600">Рейтинг</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-4xl font-bold ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 flex-grow">
          <label htmlFor="review" className="block mb-2 text-gray-600">Текст отзыва</label>
          <textarea
            id="review"
            className={`w-full h-32 border rounded p-2 resize-none overflow-auto ${error ? 'border-2 border-red-500' : ''}`}
            placeholder="Введите текст..."
            value={review}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setReview(e.target.value);
              }
            }}
            maxLength={500}
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">{review.length}/500 символов</p>
        </div>
      </div>
    </div>
  );
};

export default PostFeedback;