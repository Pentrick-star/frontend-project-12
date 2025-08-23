import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
  const { t } = useTranslation();
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('auth.usernameMin'))
      .max(20, t('auth.usernameMax'))
      .required(t('auth.usernameRequired')),
    password: Yup.string()
      .min(6, t('auth.passwordMin'))
      .required(t('auth.passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.passwordsMustMatch'))
      .required(t('auth.confirmPasswordRequired')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSignupError('');
      const response = await api.post('/signup', {
        username: values.username,
        password: values.password,
      });
      const { token } = response.data;
      login(token);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 409) {
        setSignupError(t('auth.userExists'));
      } else {
        setSignupError(t('auth.signupError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid h-100" style={{ backgroundColor: '#f5f7fa' }} data-testid="signup-page">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }} data-testid="signup-container">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src="https://frontend-chat-ru.hexlet.app/assets/avatar-DIE1AEpS.jpg" alt="Signup illustration" className="img-fluid" />
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div className="text-center" style={{ width: '100%', maxWidth: '300px' }}>
                  <h2 className="text-center mb-4" style={{ color: '#333333' }} data-testid="signup-title">{t('auth.signup')}</h2>
                  {signupError && (
                    <div className="alert alert-danger" role="alert">
                      {signupError}
                    </div>
                  )}
                  <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, values }) => (
                      <Form data-testid="signup-form">
                        <div className="mb-3 position-relative" data-testid="username-group">
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
                            data-testid="username-label"
                          >
                            Имя пользователя
                          </label>
                          <ErrorMessage name="username" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3 position-relative" data-testid="password-group">
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
                            data-testid="password-label"
                          >
                            Пароль
                          </label>
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-4 position-relative" data-testid="confirm-password-group">
                          <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            style={{ 
                              borderColor: '#ced4da',
                              paddingTop: '1.625rem',
                              paddingBottom: '0.375rem',
                              height: 'auto'
                            }}
                            data-testid="confirm-password-field"
                          />
                          <label 
                            htmlFor="confirmPassword" 
                            className="position-absolute"
                            style={{ 
                              left: '0.75rem',
                              top: values.confirmPassword ? '0.125rem' : '0.75rem',
                              fontSize: values.confirmPassword ? '0.75rem' : '1rem',
                              color: values.confirmPassword ? '#6c757d' : '#333333',
                              transition: 'all 0.15s ease-in-out',
                              pointerEvents: 'none',
                              transform: values.confirmPassword ? 'translateY(0)' : 'translateY(0)',
                              lineHeight: '1.5'
                            }}
                            data-testid="confirm-password-label"
                          >
                            Подтвердите пароль
                          </label>
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
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
                          data-testid="signup-button"
                        >
                          {isSubmitting ? t('auth.signingUp') : t('auth.signupButton')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    <span style={{ color: '#333333' }}>{t('auth.hasAccount')}</span> <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>{t('auth.loginLink')}</Link>
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

export default SignupPage;
