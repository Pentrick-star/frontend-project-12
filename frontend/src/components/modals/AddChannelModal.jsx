import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addChannel } from '../../store/slices/channelsSlice';
import { channelsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { filterProfanity } from '../../utils/profanityFilter';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('interface.from3To20'))
      .max(20, t('validation.maxLength', { max: 20 }))
      .required(t('validation.required')),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name);
      const response = await channelsAPI.createChannel(filteredName);
      dispatch(addChannel(response));
      toast.success(t('notifications.channelCreated'));
      resetForm();
      onHide();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(t('validation.channelNameExists'));
      } else {
        toast.error(t('notifications.networkError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('interface.addChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="channelName" className="form-label">
                  {t('interface.channelName')}
                </label>
                <Field
                  type="text"
                  name="name"
                  id="channelName"
                  className="form-control"
                  placeholder={t('interface.channelName')}
                  autoFocus
                />
                <ErrorMessage name="name" component="div" className="text-danger mt-1" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('channels.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? t('interface.add') + '...' : t('interface.add')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
