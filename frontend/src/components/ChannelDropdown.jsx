import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChannelDropdown = ({ channelId, onRename, onRemove }) => {
  const { t } = useTranslation();
  const { channels } = useSelector((state) => state.channels);
  
  const channel = channels.find(ch => ch.id === channelId);
  const [show, setShow] = useState(false);

  if (!channel) return null;

  const handleRename = () => {
    onRename(channelId);
    setShow(false);
  };

  const handleRemove = () => {
    onRemove(channelId);
    setShow(false);
  };

  return (
    <Dropdown show={show} onToggle={(isOpen) => setShow(isOpen)}>
      <Dropdown.Toggle
        variant="link"
        size="sm"
        className="text-muted p-0 border-0"
        style={{ boxShadow: 'none' }}
      >
        <span className="text-muted">⋮</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {channel.removable && (
          <>
            <Dropdown.Item onClick={handleRename}>
              {t('interface.rename')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRemove} className="text-danger">
              {t('interface.remove')}
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelDropdown;
