import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

const ChannelDropdown = ({ channelId, onRename, onRemove, removable = true }) => {
  const { t } = useTranslation();

  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" size="sm" className="text-muted p-0">
        <span className="visually-hidden">{t('interface.channelManagement')}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 11L3 6h10l-5 5z"/>
        </svg>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onRename(channelId)}>
          {t('interface.rename')}
        </Dropdown.Item>
        {removable && (
          <Dropdown.Item onClick={() => onRemove(channelId)} className="text-danger">
            {t('interface.remove')}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelDropdown;
