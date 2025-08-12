import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Badge, Button } from 'react-bootstrap';
import { setCurrentChannel } from '../store/slices/channelsSlice';
import ChannelDropdown from './ChannelDropdown';
import AddChannelModal from './modals/AddChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';

const ChannelsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, currentChannelId, loading } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleRename = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRenameModal(true);
  };

  const handleRemove = (channelId) => {
    setSelectedChannelId(channelId);
    setShowRemoveModal(true);
  };

  const getMessageCount = (channelId) => {
    return messages[channelId]?.length || 0;
  };

  if (loading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Загрузка каналов...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="channels-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-muted mb-0">{t('interface.channelManagement')}</h6>
                  <Button
            variant="link"
            size="sm"
            className="text-muted p-0"
            onClick={() => setShowAddModal(true)}
          >
            {t('interface.add')}
          </Button>
      </div>
      
      <ListGroup variant="flush">
        {channels.map((channel) => (
          <ListGroup.Item
            key={channel.id}
            action
            active={currentChannelId === channel.id}
            onClick={() => handleChannelClick(channel.id)}
            className="d-flex justify-content-between align-items-center border-0 rounded mb-1"
            style={{
              backgroundColor: currentChannelId === channel.id ? '#e3f2fd' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span className="text-truncate"># {channel.name}</span>
            <div className="d-flex align-items-center">
              {getMessageCount(channel.id) > 0 && (
                <Badge bg="secondary" className="me-2">
                  {getMessageCount(channel.id)}
                </Badge>
              )}
              <ChannelDropdown
                channelId={channel.id}
                onRename={handleRename}
                onRemove={handleRemove}
              />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => setShowRenameModal(false)}
        channelId={selectedChannelId}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        channelId={selectedChannelId}
      />
    </div>
  );
};

export default ChannelsList;
