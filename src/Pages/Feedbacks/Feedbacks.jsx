import React, { useState, useEffect } from 'react';
import { getFeedbacks, removeFeedback, getUser } from '../../db/db';

async function get_telegram_user(user_id) {
  return fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChat?chat_id=${user_id}`).then(res => res.json());
}

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getFeedbacks();
        setFeedbacks(data);

        // TODO: проверка роли пользователя
        setIsAdmin(true);
      } catch (error) {
        console.error('Error loading feedbacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await removeFeedback(feedbackId);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Загрузка отзывов...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Отзывы</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {feedbacks.map((feedback) => (
          <FeedbackItem 
            key={feedback.id} 
            feedback={feedback} 
            isAdmin={isAdmin} 
            onDelete={handleDeleteFeedback} 
          />
        ))}
      </div>
    </div>
  );
}

const FeedbackItem = ({ feedback, isAdmin, onDelete }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(feedback.user_id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [feedback.user_id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <img
          src={user?.profile_photo || 'https://via.placeholder.com/40?text=?'}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=?'; }}
          alt="User Avatar"
          style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', marginRight: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '2px solid #e5e7eb' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600' }}>{user?.nickname || 'Аноним'}</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {new Date(feedback.time).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {isAdmin && (
            <button style={{ marginRight: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onDelete(feedback.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <div style={{ display: 'flex', color: '#fbbf24' }}>
            {'★'.repeat(feedback.stars)}{'☆'.repeat(5 - feedback.stars)}
          </div>
        </div>
      </div>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '0.75rem' }}>
        <p style={{ fontSize: '0.875rem' }}>{feedback.text}</p>
      </div>
    </div>
  );
};