import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';

const ConnectionStatus = () => {
  const { t } = useTranslation();
  const { isConnected, connectionError } = useSelector((state) => state.ui);

  if (connectionError) {
    return (
      <Badge bg="danger" className="ms-2">
        <small>{t('status.connectionError')}</small>
      </Badge>
    );
  }

  return (
    <Badge bg={isConnected ? "success" : "warning"} className="ms-2">
      <small>{isConnected ? t('status.connected') : t('status.connecting')}</small>
    </Badge>
  );
};

export default ConnectionStatus;
