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
    <div className="container-fluid h-100" data-testid="signup-page">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm" data-testid="signup-container">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div>
                  <h2 className="text-center mb-4" data-testid="signup-title">{t('auth.signup')}</h2>
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
                    {({ isSubmitting }) => (
                      <Form data-testid="signup-form">
                        <div className="mb-3" data-testid="username-group">
                          <label htmlFor="username" className="form-label" data-testid="username-label">{t('auth.username')}</label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            data-testid="username-field"
                          />
                          <ErrorMessage name="username" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3" data-testid="password-group">
                          <label htmlFor="password" className="form-label" data-testid="password-label">{t('auth.password')}</label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            data-testid="password-field"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-4" data-testid="confirm-password-group">
                          <label htmlFor="confirmPassword" className="form-label" data-testid="confirm-password-label">{t('auth.confirmPassword')}</label>
                          <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            data-testid="confirm-password-field"
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-100 btn btn-primary" data-testid="signup-button">
                          {isSubmitting ? t('auth.signingUp') : t('auth.signupButton')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    {t('auth.hasAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
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
