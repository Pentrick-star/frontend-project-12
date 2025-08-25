import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeChannel } from '../store/channelsSlice';

const RemoveChannelModal = ({ isOpen, onClose, channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  


  useEffect(() => {
    const handleEscape = (e) => {
      try {
        if (e.key === 'Escape') {
          try {
            onClose();
          } catch (error) {
            console.error('Failed to close modal on escape:', error);
          }
        }
      } catch (error) {
        console.error('Failed to handle escape key:', error);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleRemove = async () => {
    try {
      try {
        setIsRemoving(true);
      } catch (error) {
        console.error('Failed to set removing state to true:', error);
      }
      try {
        await dispatch(removeChannel((() => {
          try {
            return channel.id;
          } catch (error) {
            console.error('Failed to get channel id:', error);
            throw new Error('Invalid channel id');
          }
        })())).unwrap();
      } catch (error) {
        console.error('Failed to dispatch removeChannel:', error);
        throw error;
      }
      try {
        onClose();
      } catch (error) {
        console.error('Failed to close modal in handleRemove:', error);
      }
    } catch (error) {
      console.error('Failed to remove channel:', error);
      // Ошибка уже обрабатывается в slice через toast
    } finally {
      try {
        setIsRemoving(false);
      } catch (error) {
        console.error('Failed to set removing state:', error);
      }
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <>
      <div className="modal-backdrop fade show"       onClick={() => {
        try {
          onClose();
        } catch (error) {
          console.error('Failed to close modal on backdrop click:', error);
        }
      }} style={{ zIndex: 1040 }}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h5">{t('modals.titles.deletingChannel')}</div>
            <button type="button" className="btn-close"               onClick={() => {
                try {
                  onClose();
                } catch (error) {
                  console.error('Failed to close modal on button click:', error);
                }
              }} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>
              {t('modals.deleteQuestion')} <b>{(() => {
                try {
                  return channel.name;
                } catch (error) {
                  console.error('Failed to get channel name:', error);
                  return 'Unknown';
                }
              })()}</b>?
            </p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              onClick={() => {
                try {
                  onClose();
                } catch (error) {
                  console.error('Failed to close modal on cancel click:', error);
                }
              }} 
              className="btn btn-secondary"
            >
              {t('modals.deleteBtns.cancel')}
            </button>
            <button 
              type="button" 
              onClick={handleRemove} 
              disabled={(() => {
                try {
                  return isRemoving;
                } catch (error) {
                  console.error('Failed to check removing state:', error);
                  return false;
                }
              })()}
              className="btn btn-danger"
            >
              {(() => {
                try {
                  return isRemoving;
                } catch (error) {
                  console.error('Failed to check removing state for content:', error);
                  return false;
                }
              })() ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('loading.deleting')}
                </>
              ) : (
                t('modals.deleteBtns.delete')
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveChannelModal;
