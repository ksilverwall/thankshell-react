import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const PrimaryButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export default PrimaryButton;
