import React from 'react';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="channels-sidebar">
          <h2>Каналы</h2>
          <div className="channels-list">
            <div className="channel-item"># general</div>
            <div className="channel-item"># random</div>
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-messages">
            <div className="message">
              <strong>admin:</strong> Привет всем!
            </div>
            <div className="message">
              <strong>user:</strong> Привет!
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Введите сообщение..." />
            <button>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
