import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSignupError('');
      const response = await axios.post('/api/v1/signup', {
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
    <div className="signup-page">
      <div className="signup-container">
        <h1>{t('auth.signup')}</h1>
        {signupError && (
          <div className="signup-error">
            {signupError}
          </div>
        )}
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="signup-form">
              <div className="form-group">
                <label htmlFor="username">{t('auth.username')}</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
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
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? t('auth.signingUp') : t('auth.signupButton')}
              </button>
            </Form>
          )}
        </Formik>
        <div className="signup-link">
          {t('auth.hasAccount')} <Link to="/login">{t('auth.loginLink')}</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
