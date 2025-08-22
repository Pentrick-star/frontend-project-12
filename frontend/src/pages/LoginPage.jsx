import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { t } = useTranslation();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    username: Yup.string().required(t('auth.usernameRequired')),
    password: Yup.string().required(t('auth.passwordRequired')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
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
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" alt="Login illustration" className="img-fluid" />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ width: '100%', maxWidth: '300px' }}>
                  <h2 className="text-center mb-4">{t('auth.login')}</h2>
                  {authError && (
                    <div className="alert alert-danger" role="alert">
                      {authError}
                    </div>
                  )}
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">{t('auth.username')}</label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            data-testid="username-field"
                          />
                          <ErrorMessage name="username" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="password" className="form-label">{t('auth.password')}</label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            data-testid="password-field"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-100 btn btn-primary" data-testid="login-button">
                          {isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    {t('auth.noAccount')} <Link to="/signup">{t('auth.signupLink')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
