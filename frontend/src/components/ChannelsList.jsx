import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channelsTitle')}</span>
        <button 
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => setShowAddModal(true)}
          title={t('modals.titles.addingChannel')}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="visually-hidden">{t('modals.titles.addingChannel')}</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100 position-relative">
            <div className="d-flex justify-content-between align-items-start w-100">
              <button
                type="button"
                className={`w-100 rounded-0 text-start text-truncate btn ${
                  channel.id === currentChannelId ? 'btn-secondary text-white' : ''
                }`}
                onClick={() => handleChannelClick(channel.id)}
              >
                <span className="me-1">#</span>
                {channel.name}
              </button>
              <div className="dropdown flex-shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  className="btn btn-sm text-dark p-0"
                  onClick={(e) => handleDropdownToggle(channel.id, e)}
                >
                  <i className="bi bi-chevron-down"></i>
                  <span className="visually-hidden">{t('manageChannelsBtns.rename')}</span>
                </button>
              </div>
            </div>
            {showDropdown === channel.id && (
              <ul className="dropdown-menu show" style={{ 
                position: 'absolute', 
                left: '0', 
                top: '100%', 
                zIndex: 1000, 
                width: '100%', 
                marginTop: '0',
                border: '1px solid #dee2e6',
                borderRadius: '0.375rem',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                backgroundColor: '#fff'
              }}>
                <li>
                  <button 
                    type="button" 
                    className="dropdown-item"
                    onClick={() => handleRename(channel)}
                  >
                    {t('manageChannelsBtns.rename')}
                  </button>
                </li>
                {isRemovable(channel) && (
                  <li>
                    <button 
                      type="button" 
                      className="dropdown-item text-danger"
                      onClick={() => handleRemove(channel)}
                    >
                      {t('manageChannelsBtns.delete')}
                    </button>
                  </li>
                )}
              </ul>
            )}
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
