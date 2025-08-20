import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>{t('errors.notFound')}</h1>
        <h2>{t('errors.notFoundTitle')}</h2>
        <p>{t('errors.notFoundMessage')}</p>
        <Link to="/" className="back-link">
          {t('common.back')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
