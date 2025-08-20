import React from 'react';
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
      .min(3, t('chat.channelNameMin'))
      .max(20, t('chat.channelNameMax'))
      .required(t('chat.channelNameRequired'))
      .test('unique', t('chat.channelExists'), function(value) {
        if (!value || !channel) return true;
        return !channels.some(ch => 
          ch.id !== channel.id && ch.name.toLowerCase() === value.toLowerCase()
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name);
      await dispatch(renameChannel({ channelId: channel.id, name: filteredName })).unwrap();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to rename channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('chat.renameChannelTitle')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <Formik
          initialValues={{ name: channel.name }}
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
                  {isSubmitting ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RenameChannelModal;
