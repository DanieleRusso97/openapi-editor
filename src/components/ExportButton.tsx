import React from 'react';
import { Button } from '@mui/material';

interface ExportButtonProps {
  openApiSpec: any;
}

const ExportButton: React.FC<ExportButtonProps> = ({ openApiSpec }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'openapi.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button variant="contained" color="secondary" onClick={handleExport}>Export</Button>;
};

export default ExportButton;