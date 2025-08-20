import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
  const validationSchema = Yup.object({
    username: Yup.string().required('Имя пользователя обязательно'),
    password: Yup.string().required('Пароль обязателен'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted:', values);
    setSubmitting(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Вход в чат</h1>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="username">Имя пользователя</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
