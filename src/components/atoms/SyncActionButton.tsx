import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const SyncActionButton = ({ text, onClick }: { text: string; onClick: () => Promise<void>; }) => {
  const [processing, setProcessing] = useState<boolean>(false);

  const onClickInternal = async () => {
    setProcessing(true);
    await onClick();
    setProcessing(false);
  };

  return <Button onClick={onClickInternal} disabled={processing}>{text}</Button>;
};

export default SyncActionButton;
