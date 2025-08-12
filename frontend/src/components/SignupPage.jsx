import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Card, Button, Alert } from 'react-bootstrap';
// import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const SignupPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('interface.from3To20'))
      .max(20, t('validation.maxLength', { max: 20 }))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('interface.atLeast6'))
      .required(t('validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('interface.passwordsMustMatch'))
      .required(t('validation.required')),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setError('');
      const response = await authAPI.signup(values.username, values.password);
      
      // Сохраняем токен и перенаправляем на чат
      localStorage.setItem('token', response.token);
      if (onLogin) {
        onLogin();
      }
      navigate('/');
    } catch (err) {
      if (err.response?.status === 409) {
        setFieldError('username', t('validation.usernameExists'));
      } else {
        setError(err.response?.data?.message || t('errors.unknownError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body className="p-4">
                  <Card.Title className="text-center mb-4">
          {t('interface.signup')}
        </Card.Title>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              username: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <Field
                    name="username"
                    type="text"
                    placeholder={t('interface.username')}
                    className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <Field
                    name="password"
                    type="password"
                    placeholder={t('interface.password')}
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder={t('interface.confirmPassword')}
                    className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('interface.register') + '...' : t('interface.register')}
                </Button>

                <div className="text-center">
                  <span className="text-muted">{t('auth.hasAccount')} </span>
                  <Link to="/login" className="text-decoration-none">
                    {t('interface.login')}
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignupPage;
