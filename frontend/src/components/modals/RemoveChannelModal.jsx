import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel } from '../../store/slices/channelsSlice';
import { clearMessages } from '../../store/slices/messagesSlice';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channels);

  const channel = channels.find(ch => ch.id === channelId);

  const handleRemove = () => {
    if (!channel) return;

    // Удаляем канал
    dispatch(removeChannel(channelId));
    
    // Удаляем сообщения канала
    dispatch(clearMessages(channelId));
    
    onHide();
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('channels.confirmRemove', { name: channel.name })}</p>
        <p className="text-muted">{t('channels.confirmRemoveText')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('channels.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('channels.removeChannel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
