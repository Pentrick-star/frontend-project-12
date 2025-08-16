import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel } from '../../store/slices/channelsSlice';
import { channelsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const channel = channels.find(ch => ch.id === channelId);

  const handleRemove = async () => {
    try {
      await channelsAPI.removeChannel(channelId);
      dispatch(removeChannel(channelId));
      toast.success(t('notifications.channelRemoved'));
      onHide();
    } catch (error) {
      toast.error(t('notifications.networkError'));
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('interface.removeChannel')}</Modal.Title>
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
          {t('interface.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
