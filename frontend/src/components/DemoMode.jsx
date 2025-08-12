import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/messagesSlice';
import { addMockMessage } from '../utils/testData';

const DemoMode = () => {
  const { t } = useTranslation();
  const [showDemo, setShowDemo] = useState(false);
  const dispatch = useDispatch();

  const handleAddDemoMessage = () => {
    const demoMessages = [
      'Привет! Как дела?',
      'Отличная погода сегодня!',
      'Кто-нибудь смотрел новый фильм?',
      'Помогите с домашним заданием 😅',
      'Спасибо за помощь!',
    ];

    const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
    const randomChannelId = Math.floor(Math.random() * 3) + 1;
    const randomUsername = `user${Math.floor(Math.random() * 1000)}`;

    const newMessage = addMockMessage(randomChannelId, randomMessage, randomUsername);
    
    dispatch(addMessage({
      channelId: randomChannelId,
      message: newMessage,
    }));
  };

  if (!showDemo) {
    return (
      <Alert variant="info" className="m-3">
        <Alert.Heading>{t('demo.title')}</Alert.Heading>
        <p>
          {t('demo.description')}
        </p>
        <Button onClick={() => setShowDemo(true)}>
          {t('demo.enable')}
        </Button>
      </Alert>
    );
  }

  return (
    <Alert variant="success" className="m-3">
      <Alert.Heading>{t('demo.active')}</Alert.Heading>
      <p>
        Добавляйте тестовые сообщения для демонстрации работы чата.
      </p>
      <Button onClick={handleAddDemoMessage} variant="outline-success">
        {t('demo.addMessage')}
      </Button>
      <hr />
      <Button onClick={() => setShowDemo(false)} variant="outline-secondary" size="sm">
        {t('demo.disable')}
      </Button>
    </Alert>
  );
};

export default DemoMode;
