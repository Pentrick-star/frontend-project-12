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
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h5">{t('chat.removeChannelTitle')}</div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{t('chat.removeChannelConfirm')} <strong>#{channel.name}</strong>?</p>
            <p>{t('chat.removeChannelWarning')}</p>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {t('common.cancel')}
            </button>
            <button type="button" onClick={handleRemove} className="btn btn-danger">
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;
