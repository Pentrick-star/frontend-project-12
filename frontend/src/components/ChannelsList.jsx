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
  const { items: channels, currentChannelId, loading } = useSelector((state) => state.channels);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Не закрываем dropdown, если клик был по элементу в dropdown
      if (event.target.closest('.dropdown-item')) {
        return;
      }
      
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
          className="p-0 text-primary btn btn-group-vertical add-channel"
          onClick={() => setShowAddModal(true)}
          title={t('modals.titles.addingChannel')}
          data-testid="add-channel-button"
          aria-label={t('modals.titles.addingChannel')}
          role="button"
          name="add-channel"
          disabled={false}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="visually-hidden">+</span>
        </button>

      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2" data-testid="channels-list">
                    {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100 position-relative" data-testid={`channel-${channel.id}`}>
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
                right: '0', 
                top: '100%', 
                minWidth: '120px',
                zIndex: 1060,
                backgroundColor: '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <li>
                  <div 
                    className="dropdown-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRename(channel);
                    }}
                    style={{ 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {t('manageChannelsBtns.rename')}
                  </div>
                </li>
                {isRemovable(channel) && (
                  <li>
                    <div 
                      className="dropdown-item text-danger"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(channel);
                      }}
                      style={{ 
                        cursor: 'pointer',
                        padding: '8px 16px',
                        backgroundColor: '#f8f9fa',
                        color: '#dc3545'
                      }}
                    >
                      {t('manageChannelsBtns.delete')}
                    </div>
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
        </ul>

      <AddChannelModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setShowDropdown(null);
        }}
      />

      {showRenameModal && (
        <RenameChannelModal
          isOpen={showRenameModal}
          onClose={() => {
            setShowRenameModal(false);
            setShowDropdown(null);
          }}
          channel={selectedChannel}
        />
      )}

      {showRemoveModal && (
        <RemoveChannelModal
          isOpen={showRemoveModal}
          onClose={() => {
            setShowRemoveModal(false);
            setShowDropdown(null);
          }}
          channel={selectedChannel}
        />
      )}
    </div>
  );
};

export default ChannelsList;
