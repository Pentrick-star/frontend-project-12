import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addChannel, setCurrentChannel } from '../../store/slices/channelsSlice';
import { filterProfanity } from '../../utils/profanityFilter';

const AddChannelModal = ({ show, onHide }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channels);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('interface.from3To20'))
      .max(20, t('validation.maxLength', { max: 20 }))
      .required(t('validation.required'))
      .test('unique', t('validation.channelNameExists'), (value) => {
        if (!value) return true;
        return !channels.some(channel => channel.name === value);
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const filteredName = filterProfanity(values.name);
      const newChannel = {
        id: Date.now(), // В реальном приложении ID будет приходить с сервера
        name: filteredName,
        removable: true,
      };

      dispatch(addChannel(newChannel));
      dispatch(setCurrentChannel(newChannel.id));
      
      toast.success(t('notifications.channelCreated'));
      resetForm();
      onHide();
    } catch (error) {
      console.error('Error adding channel:', error);
      toast.error(t('notifications.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('interface.channelName')}</Modal.Title>
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
                  placeholder={t('interface.channelName')}
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
