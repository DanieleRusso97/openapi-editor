import Editor from '@monaco-editor/react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import yaml from 'js-yaml';
import React, { useState } from 'react';
import Split from 'react-split';
import SwaggerPlugin from './components/SwaggerPlugin';
import './App.css';
import FileUpload from './components/FileUpload';
import { FileType } from './types/common';

const App: React.FC = () => {
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);
  const [fileType, setFileType] = useState(FileType.JSON);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (fileContent: string) => {
    try {
      const parsedContent = JSON.parse(fileContent);
      setOpenApiSpec(parsedContent);
      setFileType(FileType.JSON);
    } catch (jsonError) {
      try {
        const parsedContent = yaml.load(fileContent);
        setOpenApiSpec(parsedContent);
        setFileType(FileType.YAML);
      } catch (yamlError) {
        console.error('Invalid file format');
      }
    }
  };

  const handleSpecChange = (value: string | undefined) => {
    if (value) {
      setError(null);
      try {
        const newSpec =
          fileType === FileType.JSON ? JSON.parse(value) : yaml.load(value);
        setOpenApiSpec(newSpec);
      } catch (error) {
        const e = error as Error;
        setError(e.message);
        console.error('Invalid OpenAPI');
      }
    }
  };

  return (
    <>
      {!openApiSpec ? (
        <>
          <Typography variant='h2' component='h1' gutterBottom>
            OpenAPI Editor
          </Typography>
          <Box mb={4}>
            <FileUpload onFileUpload={handleFileUpload} />
          </Box>
        </>
      ) : (
        <Split className='split' minSize={500}>
          <Box height={'100vh'} boxSizing={'border-box'}>
            <Editor
              height='100%'
              defaultLanguage={fileType}
              theme='vs-dark'
              language={fileType}
              value={
                fileType === FileType.JSON
                  ? JSON.stringify(openApiSpec, null, 2)
                  : yaml.dump(openApiSpec)
              }
              onChange={handleSpecChange}
            />
          </Box>
          <Box height={'100vh'} overflow={'auto'}>
            {error ? (
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                height={'100%'}
              >
                <Card sx={{ maxWidth: '500px' }}>
                  <CardHeader title={'Error OpenAPI format'} />
                  <CardContent>{error}</CardContent>
                </Card>
              </Box>
            ) : (
              <SwaggerPlugin
                fileType={fileType}
                spec={openApiSpec}
                onSpecChange={setOpenApiSpec}
              />
            )}
          </Box>
        </Split>
      )}
    </>
  );
};

export default App;
