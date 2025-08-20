import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { createChannel } from '../store/channelsSlice';

const AddChannelModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.items);
  const loading = useSelector((state) => state.channels.loading);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('chat.channelNameMin'))
      .max(20, t('chat.channelNameMax'))
      .required(t('chat.channelNameRequired'))
      .test('unique', t('chat.channelExists'), function(value) {
        if (!value) return true;
        return !channels.some(channel => 
          channel.name.toLowerCase() === value.toLowerCase()
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(createChannel(values)).unwrap();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('chat.addChannelTitle')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="modal-form">
              <div className="form-group">
                <label htmlFor="channelName">{t('chat.channelName')}</label>
                <Field
                  type="text"
                  id="channelName"
                  name="name"
                  className="form-control"
                  autoFocus
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-secondary">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? t('common.creating') : t('common.create')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddChannelModal;
