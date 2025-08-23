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
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2">
        <span style={{ color: '#333333' }}>{t('chat.channels')}</span>
        <button 
          type="button"
          className="p-0 btn btn-group-vertical"
          style={{ color: '#007bff' }}
          onClick={() => setShowAddModal(true)}
          title={t('chat.addChannel')}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="visually-hidden">{t('chat.addChannel')}</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <div className="d-flex justify-content-between align-items-start w-100">
              <button
                type="button"
                className={`w-100 rounded-0 text-start text-truncate btn ${
                  channel.id === currentChannelId ? '' : ''
                }`}
                style={{
                  backgroundColor: channel.id === currentChannelId ? '#007bff' : 'transparent',
                  color: channel.id === currentChannelId ? '#ffffff' : '#333333',
                  border: 'none'
                }}
                onClick={() => handleChannelClick(channel.id)}
              >
                <span className="me-1">#</span>
                {channel.name}
              </button>
              {!isStandardChannel(channel) && (
                <div className="dropdown flex-shrink-0">
                  <button
                    type="button"
                    className="btn btn-sm p-0 dropdown-toggle"
                    style={{ color: '#6c757d' }}
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
          </li>
        ))}
      </ul>

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
