import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { renameChannel } from '../store/channelsSlice';

const RenameChannelModal = ({ isOpen, onClose, channel }) => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.items);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required('Обязательное поле')
      .test('unique', 'Канал с таким именем уже существует', function(value) {
        if (!value || !channel) return true;
        return !channels.some(ch => 
          ch.id !== channel.id && ch.name.toLowerCase() === value.toLowerCase()
        );
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(renameChannel({ channelId: channel.id, name: values.name })).unwrap();
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
          <h3>Переименовать канал</h3>
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
                <label htmlFor="channelName">Имя канала</label>
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
                  Отмена
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
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
