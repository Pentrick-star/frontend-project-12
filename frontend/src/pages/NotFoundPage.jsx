import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <h1 className="display-1 text-muted">{t('errors.notFound')}</h1>
                  <h2 className="h4 text-muted mb-4">{t('errors.notFoundTitle')}</h2>
                  <p className="text-muted mb-4">{t('errors.notFoundMessage')}</p>
                  <Link to="/" className="btn btn-primary">
                    {t('common.back')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
