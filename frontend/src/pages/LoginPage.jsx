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
    <div className="container-fluid h-100" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" alt="Login illustration" className="img-fluid" />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ width: '100%', maxWidth: '300px' }}>
                  <h2 className="text-center mb-4" style={{ color: '#333333' }}>{t('auth.login')}</h2>
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
                    {({ isSubmitting, values }) => (
                      <Form>
                        <div className="mb-3 position-relative">
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            style={{ 
                              borderColor: '#ced4da',
                              paddingTop: '1.625rem',
                              paddingBottom: '0.375rem',
                              height: 'auto'
                            }}
                            data-testid="username-field"
                          />
                          <label 
                            htmlFor="username" 
                            className="position-absolute"
                            style={{ 
                              left: '0.75rem',
                              top: values.username ? '0.125rem' : '0.75rem',
                              fontSize: values.username ? '0.75rem' : '1rem',
                              color: values.username ? '#6c757d' : '#333333',
                              transition: 'all 0.15s ease-in-out',
                              pointerEvents: 'none',
                              transform: values.username ? 'translateY(0)' : 'translateY(0)',
                              lineHeight: '1.5'
                            }}
                          >
                            Ваш ник
                          </label>
                          <ErrorMessage name="username" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-4 position-relative">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            style={{ 
                              borderColor: '#ced4da',
                              paddingTop: '1.625rem',
                              paddingBottom: '0.375rem',
                              height: 'auto'
                            }}
                            data-testid="password-field"
                          />
                          <label 
                            htmlFor="password" 
                            className="position-absolute"
                            style={{ 
                              left: '0.75rem',
                              top: values.password ? '0.125rem' : '0.75rem',
                              fontSize: values.password ? '0.75rem' : '1rem',
                              color: values.password ? '#6c757d' : '#333333',
                              transition: 'all 0.15s ease-in-out',
                              pointerEvents: 'none',
                              transform: values.password ? 'translateY(0)' : 'translateY(0)',
                              lineHeight: '1.5'
                            }}
                          >
                            Пароль
                          </label>
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting} 
                          className="w-100 btn" 
                          style={{ 
                            backgroundColor: '#007bff', 
                            borderColor: '#007bff',
                            color: '#ffffff'
                          }}
                          data-testid="login-button"
                        >
                          {isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    <span style={{ color: '#333333' }}>{t('auth.noAccount')}</span> <Link to="/signup" style={{ color: '#007bff', textDecoration: 'underline' }}>{t('auth.signupLink')}</Link>
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
