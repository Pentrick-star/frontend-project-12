import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { renameChannel } from '../store/channelsSlice';
import { filterProfanity } from '../utils/profanityFilter';

const RenameChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.items);
  


  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.addErrors.min'))
      .max(20, t('modals.addErrors.max'))
      .required(t('modals.addErrors.required'))
      .test('unique', t('modals.addErrors.repeats'), function(value) {
        if (!value || !channel) return true;
        return !channels.some(ch => 
          ch.id !== channel.id && ch.name.toLowerCase() === value.toLowerCase()
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name);
      await dispatch(renameChannel({ 
        channelId: channel.id, 
        name: filteredName 
      })).unwrap();
      resetForm();
      // Добавляем небольшую задержку, чтобы toast успел появиться
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      // Ошибка уже обрабатывается в slice через toast
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

  if (!isOpen || !channel) return null;

  return (
    <>
      <div className="modal-backdrop fade show"       onClick={() => {
        try {
          onClose();
        } catch (error) {
          console.error('Failed to close modal on backdrop click:', error);
        }
      }} style={{ zIndex: 1040 }}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h5">{t('modals.titles.renamingChannel')}</div>
            <button type="button" className="btn-close"               onClick={() => {
                try {
                  onClose();
                } catch (error) {
                  console.error('Failed to close modal on button click:', error);
                }
              }} aria-label="Close"></button>
          </div>
          <Formik
            initialValues={{ name: (() => {
              try {
                return channel.name;
              } catch (error) {
                console.error('Failed to get channel name for initial value:', error);
                return '';
              }
            })() }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
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
                    />
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={() => {
                      try {
                        onClose();
                      } catch (error) {
                        console.error('Failed to close modal on cancel click:', error);
                      }
                    }} 
                    className="btn btn-secondary"
                  >
                    {t('modals.renameBtns.cancel')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={(() => {
                      try {
                        return isSubmitting;
                      } catch (error) {
                        console.error('Failed to check submitting state:', error);
                        return false;
                      }
                    })()} 
                    className="btn btn-primary"
                  >
                    {(() => {
                      try {
                        return isSubmitting;
                      } catch (error) {
                        console.error('Failed to check submitting state for content:', error);
                        return false;
                      }
                    })() ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('loading.saving')}
                      </>
                    ) : (
                      t('modals.renameBtns.submit')
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

export default RenameChannelModal;