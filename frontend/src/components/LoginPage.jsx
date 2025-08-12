import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { authAPI } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .required('Имя пользователя обязательно'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен'),
});

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      
      // Пытаемся авторизоваться через API
      const response = await authAPI.login(values.username, values.password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        onLogin(response.token);
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Неверные учетные данные');
      } else {
        setError('Ошибка при авторизации. Попробуйте еще раз.');
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
              Вход в чат
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
                        Имя пользователя
                      </label>
                      <Field
                        type="text"
                        name="username"
                        id="username"
                        className="form-control"
                        placeholder="Введите имя пользователя"
                      />
                      <ErrorMessage name="username" component="div" className="text-danger mt-1" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Пароль
                      </label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        placeholder="Введите пароль"
                      />
                      <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Вход...' : 'Войти'}
                    </Button>
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
