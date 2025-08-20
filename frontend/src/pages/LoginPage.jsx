import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    username: Yup.string().required(t('auth.usernameRequired')),
    password: Yup.string().required(t('auth.passwordRequired')),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setAuthError('');
      const response = await api.post('/login', values);
      const { token } = response.data;
      login(token);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthError(t('auth.invalidCredentials'));
      } else {
        setAuthError(t('auth.loginError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{t('auth.login')}</h1>
        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">{t('auth.username')}</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  data-testid="username-field"
                />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('auth.password')}</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  data-testid="password-field"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn" data-testid="login-button">
                {isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}
              </button>
            </Form>
          )}
        </Formik>
        <div className="login-link">
          {t('auth.noAccount')} <Link to="/signup">{t('auth.signupLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
