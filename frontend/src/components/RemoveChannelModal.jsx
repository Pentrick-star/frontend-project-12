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
        <div className="modal-content" style={{ backgroundColor: '#ffffff', border: '1px solid #dee2e6' }}>
          <div className="modal-header">
            <div className="modal-title h5" style={{ color: '#333333' }}>{t('modals.titles.deletingChannel')}</div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p style={{ color: '#333333' }}>
              {t('modals.deleteQuestion')} <b>{channel.name}</b>?
            </p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: '#ffffff' }}
            >
              {t('modals.deleteBtns.cancel')}
            </button>
            <button 
              type="button" 
              onClick={handleRemove} 
              className="btn"
              style={{ 
                backgroundColor: '#dc3545', 
                borderColor: '#dc3545',
                color: '#ffffff'
              }}
            >
              {t('modals.deleteBtns.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveChannelModal;
