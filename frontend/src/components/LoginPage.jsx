import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('validation.minLength', { min: 3 }))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('validation.passwordMin'))
      .required(t('validation.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Пытаемся авторизоваться через API
      const response = await authAPI.login(values.username, values.password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        onLogin(response.token);
      } else {
        setError(t('errors.unknownError'));
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError(t('errors.unknownError'));
      } else {
        setError(t('errors.unknownError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header as="h5" className="text-center">
              {t('auth.loginTitle')}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        {t('auth.username')}
                      </label>
                      <Field
                        type="text"
                        name="username"
                        id="username"
                        className="form-control"
                        placeholder={t('auth.username')}
                      />
                      <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        {t('auth.password')}
                      </label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        placeholder={t('auth.password')}
                      />
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('auth.login') + '...' : t('auth.login')}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">{t('auth.noAccount')} </span>
                      <Link to="/signup" className="text-decoration-none">
                        {t('auth.signupLink')}
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
