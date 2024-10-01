import React, { useState, useEffect } from 'react';
import { getFeedbacks, removeFeedback, getUser, getUserFeedbacks } from '../../db/db';
import { useTelegram } from '../../hooks/useTelegram';
import CircularProgress from '@mui/material/CircularProgress';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const { tg } = useTelegram();
  const [admins, setAdmins] = useState([6384960822])

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
    const fetchUser = async () => {
      try {
        const userData = await getUser(tg.initData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getFeedbacks();
        // Sort feedbacks by time in descending order (newest first)
        const sortedFeedbacks = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setFeedbacks(sortedFeedbacks);
        setIsAdmin(admins.includes(user?.user_id));
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
      await removeFeedback(feedbackId, tg.initData);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (isLoading) {
      return (
        <div className="flex justify-center align-items-center" style={{height: '100vh'}}>
            <CircularProgress />
        </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Отзывы</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserFeedbacks(feedback.user_id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [feedback.user_id]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}><CircularProgress size={24} /></div>;
  }

  return (
    <div style={{ 
      backgroundColor: 'var(--tg-theme-bg-color)', 
      borderRadius: '12px', 
      padding: '16px', 
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
        <img
          src={user?.profile_photo || 'https://via.placeholder.com/40?text=?'}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40?text=?'; }}
          alt="User Avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--tg-theme-text-color)' }}>{user?.nickname || 'Аноним'}</span>
            <div style={{ display: 'flex', color: '#fbbf24' }}>
              {'★'.repeat(feedback.stars)}{'☆'.repeat(5 - feedback.stars)}
            </div>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', display: 'block', marginTop: '4px' }}>
            {new Date(feedback.time).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
        {isAdmin && (
          <button 
            style={{ 
              color: '#ef4444', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }} 
            onClick={() => onDelete(feedback.id)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div style={{ 
        backgroundColor: 'var(--tg-theme-secondary-bg-color)', 
        borderRadius: '8px', 
        padding: '12px',
        fontSize: '15px',
        color: 'var(--tg-theme-text-color)',
        lineHeight: '1.5'
      }}>
        <p style={{ margin: 0 }}>{feedback.text}</p>
      </div>
    </div>
  );
};