import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { setToken, fetchUser } from '../store/authSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    username: Yup.string().required(t('signupPage.required')),
    password: Yup.string().required(t('signupPage.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setAuthError('');
      const response = await api.post('/login', values);
      
      if (response.status === 200 && response.data.token) {
        const { token } = response.data;
        dispatch(setToken(token));
        
        try {
          const userResult = await dispatch(fetchUser());
          if (userResult.error) {
            console.error('Failed to fetch user:', userResult.error);
            setAuthError('Failed to load user data');
            return;
          }
          navigate('/');
        } catch (userError) {
          console.error('Error fetching user:', userError);
          setAuthError('Failed to load user data');
          return;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = t('loginPage.error');
      setAuthError(errorMessage);
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
                <div className="text-center">
                  <h2 className="text-center mb-4">{t('loginPage.title')}</h2>
                  {authError && (
                    <div className="alert alert-danger" role="alert" data-testid="login-error">
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
                          <label htmlFor="username" className="form-label">{t('loginPage.usernamePlaceholder')}</label>
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
                          <label htmlFor="password" className="form-label">{t('loginPage.passwordPlaceholder')}</label>
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            data-testid="password-field"
                          />
                          <ErrorMessage name="password" component="div" className="text-danger small" />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSubmitting} 
                          className="w-100 btn btn-primary"
                          data-testid="login-button"
                        >
                          {t('loginPage.loginBtn')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="text-center mt-3">
                    <span>{t('loginPage.noAcc')}</span> <Link to="/signup">{t('loginPage.signupLink')}</Link>
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
