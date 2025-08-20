import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Запрашиваемая страница не существует.</p>
        <Link to="/" className="back-link">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
