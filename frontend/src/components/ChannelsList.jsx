import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from '../store/channelsSlice';
import AddChannelModal from './AddChannelModal';
import RenameChannelModal from './RenameChannelModal';
import RemoveChannelModal from './RemoveChannelModal';

const ChannelsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: channels, currentChannelId } = useSelector((state) => state.channels);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
    setShowDropdown(null);
  };

  const handleDropdownToggle = (channelId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === channelId ? null : channelId);
  };

  const handleRename = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
    setShowDropdown(null);
  };

  const handleRemove = (channel) => {
    setSelectedChannel(channel);
    setShowRemoveModal(true);
    setShowDropdown(null);
  };

  const isRemovable = (channel) => {
    return channel.name !== 'general' && channel.name !== 'random';
  };

  const isStandardChannel = (channel) => {
    return channel.name === 'general' || channel.name === 'random';
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <span style={{ color: '#333333', fontWeight: 'bold' }}>{t('chat.channels')}</span>
        <button 
          type="button"
          className="btn"
          style={{ 
            color: '#007bff',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            padding: '0.25rem'
          }}
          onClick={() => setShowAddModal(true)}
          title={t('chat.addChannel')}
        >
          +
          <span className="visually-hidden">{t('chat.addChannel')}</span>
        </button>
      </div>
      <div className="flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <div key={channel.id} className="d-flex justify-content-between align-items-center px-3 py-2">
            <button
              type="button"
              className="btn text-start flex-grow-1"
              style={{
                backgroundColor: channel.id === currentChannelId ? '#6c757d' : 'transparent',
                color: channel.id === currentChannelId ? '#ffffff' : '#333333',
                border: 'none',
                padding: '0.5rem 0.75rem',
                fontSize: '0.9rem'
              }}
              onClick={() => handleChannelClick(channel.id)}
            >
              <span className="me-1">#</span>
              {channel.name}
            </button>
            {!isStandardChannel(channel) && (
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-sm dropdown-toggle"
                  style={{ 
                    color: '#6c757d',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0.25rem'
                  }}
                  onClick={(e) => handleDropdownToggle(channel.id, e)}
                >
                  <span className="visually-hidden">{t('common.edit')}</span>
                </button>
                {showDropdown === channel.id && (
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        type="button" 
                        className="dropdown-item"
                        onClick={() => handleRename(channel)}
                      >
                        {t('common.rename')}
                      </button>
                    </li>
                    {isRemovable(channel) && (
                      <li>
                        <button 
                          type="button" 
                          className="dropdown-item text-danger"
                          onClick={() => handleRemove(channel)}
                        >
                          {t('common.remove')}
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <RenameChannelModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        channel={selectedChannel}
      />

      <RemoveChannelModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        channel={selectedChannel}
      />
    </div>
  );
};

export default ChannelsList;
