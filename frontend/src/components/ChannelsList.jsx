import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import AddChannelModal from './AddChannelModal';
import RenameChannelModal from './RenameChannelModal';
import RemoveChannelModal from './RemoveChannelModal';

const ChannelsList = () => {
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

  return (
    <div className="channels-sidebar">
      <div className="channels-header">
        <h2>Каналы</h2>
        <button 
          className="add-channel-btn"
          onClick={() => setShowAddModal(true)}
          title="Добавить канал"
        >
          +
        </button>
      </div>
      <div className="channels-list">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${channel.id === currentChannelId ? 'active' : ''}`}
            onClick={() => handleChannelClick(channel.id)}
          >
            <span className="channel-name"># {channel.name}</span>
            <div className="channel-actions">
              <button
                className="channel-dropdown-btn"
                onClick={(e) => handleDropdownToggle(channel.id, e)}
              >
                ⋮
              </button>
              {showDropdown === channel.id && (
                <div className="channel-dropdown">
                  <button onClick={() => handleRename(channel)}>
                    Переименовать
                  </button>
                  {isRemovable(channel) && (
                    <button onClick={() => handleRemove(channel)}>
                      Удалить
                    </button>
                  )}
                </div>
              )}
            </div>
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
