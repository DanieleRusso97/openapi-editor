import React, { useRef } from 'react';
import { Button } from '@mui/material';

interface FileUploadProps {
  onFileUpload: (fileContent: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={() => fileInputRef.current?.click()}
      >
        Upload OpenAPI File
      </Button>
    </div>
  );
};

export default FileUpload;
