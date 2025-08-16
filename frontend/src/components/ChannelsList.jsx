import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ListGroup, Badge } from 'react-bootstrap';
import { setCurrentChannel } from '../store/slices/channelsSlice';

const ChannelsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, currentChannelId, loading } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
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
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ChannelsList;
