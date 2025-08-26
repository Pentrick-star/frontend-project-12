import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { createChannel, setCurrentChannel } from '../store/channelsSlice';
import { filterProfanity } from '../utils/profanityFilter';

const AddChannelModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.items);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.addErrors.min'))
      .max(20, t('modals.addErrors.max'))
      .required(t('modals.addErrors.required'))
      .test('unique', t('modals.addErrors.repeats'), function(value) {
        if (!value) return true;
        return !channels.some(channel => 
          channel.name.toLowerCase() === value.toLowerCase()
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name);
      await dispatch(createChannel({ name: filteredName })).unwrap();
      resetForm();
      onClose();
    } catch (error) {
      // Не закрываем модальное окно при ошибке
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose} 
        style={{ zIndex: 1040 }}
      ></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} tabIndex="-1" data-testid="add-channel-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h5">{t('modals.titles.addingChannel')}</div>
                          <button 
                type="button" 
                className="btn-close" 
                onClick={onClose} 
                aria-label="Close"
              ></button>
          </div>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form data-testid="add-channel-form">
                <div className="modal-body">
                  <div className="mb-3">
                    <Field
                      type="text"
                      id="channelName"
                      name="name"
                      className="form-control"
                      autoFocus
                      data-testid="channel-name-input"
                    />
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-secondary"
                    data-testid="cancel-button"
                  >
                    {t('modals.addBtns.cancel')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn btn-primary"
                    data-testid="submit-button"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('loading.creating')}
                      </>
                    ) : (
                      t('modals.addBtns.submit')
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddChannelModal;
