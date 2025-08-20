import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeChannel } from '../store/channelsSlice';

const RemoveChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleRemove = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to remove channel:', error);
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('chat.removeChannelTitle')}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{t('chat.removeChannelConfirm')} <strong>#{channel.name}</strong>?</p>
          <p>{t('chat.removeChannelWarning')}</p>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            {t('common.cancel')}
          </button>
          <button type="button" onClick={handleRemove} className="btn-danger">
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;
