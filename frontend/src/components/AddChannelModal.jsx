import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { createChannel } from '../store/channelsSlice';
import { filterProfanity } from '../utils/profanityFilter';

const AddChannelModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.items);

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
      const filteredName = filterProfanity(values.name);
      await dispatch(createChannel({ name: filteredName })).unwrap();
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
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h5">{t('chat.addChannelTitle')}</div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="channelName" className="form-label">{t('chat.channelName')}</label>
                    <Field
                      type="text"
                      id="channelName"
                      name="name"
                      className="form-control"
                      autoFocus
                    />
                    <ErrorMessage name="name" component="div" className="text-danger small" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    {t('common.cancel')}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? t('common.creating') : t('common.create')}
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

export default AddChannelModal;
