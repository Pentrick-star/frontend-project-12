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
      console.log('Submitting channel creation with name:', values.name);
      const filteredName = filterProfanity(values.name);
      const result = await dispatch(createChannel({ name: filteredName })).unwrap();
      console.log('Channel created successfully:', result);
      resetForm();
      // Не нужно явно устанавливать currentChannel, так как это делается в createChannel.fulfilled
      console.log('Channel created and currentChannelId should be set to:', result.id);
      // Добавляем небольшую задержку перед закрытием модального окна
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Failed to create channel:', error);
      // Не закрываем модальное окно при ошибке
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed, closing modal');
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    console.log('AddChannelModal not rendering, isOpen:', isOpen);
    return null;
  }

  console.log('AddChannelModal rendering, isOpen:', isOpen);

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        onClick={() => {
          console.log('Modal backdrop clicked');
          onClose();
        }} 
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
              onClick={() => {
                console.log('Modal close button clicked');
                onClose();
              }} 
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
                    <label htmlFor="channelName" className="form-label">{t('modals.addLabel')}</label>
                    <Field
                      type="text"
                      id="channelName"
                      name="name"
                      className="form-control"
                      autoFocus
                      data-testid="channel-name-input"
                      placeholder={t('modals.addLabel')}
                    />
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={() => {
                      console.log('Cancel button clicked');
                      onClose();
                    }} 
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
                    {isSubmitting ? t('loading.creating') : t('modals.addBtns.submit')}
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
