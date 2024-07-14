import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import {
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import yaml from 'js-yaml';
import { FileType } from '../types/common';

const SwaggerPlugin = ({
  spec,
  onSpecChange,
  fileType,
}: {
  spec: any;
  onSpecChange: (newSpec: any) => void;
  fileType: FileType;
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState('');
  const [editingMethod, setEditingMethod] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newMethod, setNewMethod] = useState('');

  useEffect(() => {
    if (editingMethod) {
      setNewMethod(editingMethod);
    }
  }, [editingMethod]);

  const handleEditClick = (path: string, method: string) => {
    setEditingPath(path);
    setEditingMethod(method);
    setNewPath(path);
    setNewMethod(method);
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    let newSpec: any;

    if (fileType === 'json') {
      newSpec = JSON.parse(JSON.stringify(spec));
    } else {
      newSpec = yaml.load(yaml.dump(spec));
    }

    if (!newSpec.paths) {
      newSpec.paths = {};
    }

    if (editingPath !== newPath || editingMethod !== newMethod) {
      if (newSpec.paths[editingPath]) {
        if (newSpec.paths[editingPath][editingMethod]) {
          const oldMethodData = newSpec.paths[editingPath][editingMethod];
          delete newSpec.paths[editingPath][editingMethod];

          if (Object.keys(newSpec.paths[editingPath]).length === 0) {
            delete newSpec.paths[editingPath];
          }

          if (!newSpec.paths[newPath]) {
            newSpec.paths[newPath] = {};
          }

          newSpec.paths[newPath][newMethod] = oldMethodData;
        }
      }
    }

    onSpecChange(newSpec);
    setEditDialogOpen(false);
  };

  const EditPlugin = () => {
    return {
      wrapComponents: {
        operations: (Original: any) => (props: any) => {
          return (
            <Box>
              <Original {...props} />
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  const newSpec =
                    fileType === 'json'
                      ? JSON.parse(JSON.stringify(spec))
                      : yaml.load(yaml.dump(spec));
                  const newPath = `/new-endpoint-${Date.now()}`;
                  if (!newSpec.paths) newSpec.paths = {};
                  newSpec.paths[newPath] = {
                    get: {
                      summary: 'New Endpoint',
                      responses: {
                        '200': {
                          description: 'Successful response',
                        },
                      },
                    },
                  };
                  onSpecChange(newSpec);
                }}
              >
                Add Endpoint
              </Button>
            </Box>
          );
        },
        OperationSummary: (Original: any) => (props: any) => {
          return (
            <Box display='flex' alignItems='center' width={'100%'}>
              <Box mx={1}>
                <IconButton
                  size='small'
                  onClick={e => {
                    e.stopPropagation();
                    handleEditClick(
                      props.operationProps.get('path'),
                      props.operationProps.get('method'),
                    );
                  }}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              </Box>
              <Original {...props} />
            </Box>
          );
        },
      },
    };
  };

  return (
    <>
      <SwaggerUI spec={spec} plugins={[EditPlugin]} />
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Endpoint</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Path'
            type='text'
            fullWidth
            value={newPath}
            onChange={e => setNewPath(e.target.value)}
          />
          <FormControl sx={{ mt: 2 }} fullWidth>
            <InputLabel id='method-label'>Method</InputLabel>
            <Select
              labelId='method-label'
              label='Method'
              value={newMethod}
              onChange={e => setNewMethod(e.target.value as string)}
              margin='dense'
            >
              <MenuItem value='get'>GET</MenuItem>
              <MenuItem value='post'>POST</MenuItem>
              <MenuItem value='put'>PUT</MenuItem>
              <MenuItem value='delete'>DELETE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SwaggerPlugin;
