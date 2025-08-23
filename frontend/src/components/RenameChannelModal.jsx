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
      await dispatch(renameChannel({ id: channel.id, name: filteredName })).unwrap();
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
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
          <div className="modal-header">
            <div className="modal-title h5" style={{ color: '#333333' }}>{t('chat.renameChannelTitle')}</div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <Formik
            initialValues={{ name: channel.name }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="channelName" className="form-label" style={{ color: '#333333' }}>{t('chat.channelName')}</label>
                    <Field
                      type="text"
                      id="channelName"
                      name="name"
                      className="form-control"
                      style={{ borderColor: '#ced4da' }}
                      autoFocus
                    />
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-secondary"
                    style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#ffffff' }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn"
                    style={{ 
                      backgroundColor: '#007bff', 
                      borderColor: '#007bff',
                      color: '#ffffff'
                    }}
                  >
                    {isSubmitting ? t('common.saving') : t('common.save')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RenameChannelModal;
