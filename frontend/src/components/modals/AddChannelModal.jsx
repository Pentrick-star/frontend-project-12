import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../../store/slices/channelsSlice';
import { setCurrentChannel } from '../../store/slices/channelsSlice';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channels);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.minLength', { min: 3 }))
      .max(20, t('validation.maxLength', { max: 20 }))
      .required(t('validation.required'))
      .test('unique', t('validation.channelNameExists'), (value) => {
        if (!value) return true;
        return !channels.some(channel => channel.name === value);
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const newChannel = {
        id: Date.now(), // В реальном приложении ID будет приходить с сервера
        name: values.name,
        removable: true,
      };

      dispatch(addChannel(newChannel));
      dispatch(setCurrentChannel(newChannel.id));
      
      resetForm();
      onHide();
    } catch (error) {
      console.error('Error adding channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.addChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <Field
                  name="name"
                  type="text"
                  placeholder={t('channels.channelName')}
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  autoFocus
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('channels.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('channels.addChannel') + '...' : t('channels.addChannel')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
