import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button, IconButton, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { getStore } from './DataProvide';

const PresentationEditor = () => {
  const { id } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditTitleModal, setOpenEditTitleModal] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current title for the presentation based on id
    getStore().then(data => {
      if (data.store && data.store[id]) {
        setTitle(data.store[id].title || 'Untitled');
      }
    });
  }, [id]);

  const handleOpenDelete = () => setOpenDeleteModal(true);
  const handleCloseDelete = () => setOpenDeleteModal(false);
  const handleOpenEditTitle = () => setOpenEditTitleModal(true);
  const handleCloseEditTitle = () => setOpenEditTitleModal(false);

  const handleDelete = () => {
    getStore()
      .then((data) => {
        delete data.store[id];
        const userToken = localStorage.getItem('token');
        const url = 'http://localhost:5005/store';

        return fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to update the presentation.');
        console.log(`Presentation with ID ${id} deleted`);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveTitle = () => {
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].title = title;
        }
        
        const userToken = localStorage.getItem('token');
        const url = 'http://localhost:5005/store';

        return fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save the title.');
        console.log(`Presentation with ID ${id} title updated to ${title}`);
        handleCloseEditTitle();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ marginTop: '5rem' }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        <IconButton onClick={handleOpenEditTitle} aria-label="edit title" sx={{ ml: 1 }}>
          <EditIcon />
        </IconButton>
      </Box>
      <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')}>
        Back
      </Button>
      <Button variant="contained" color="error" onClick={handleOpenDelete}>
        Delete Presentation
      </Button>

      {/* Edit Title Modal */}
      <Modal
        open={openEditTitleModal}
        onClose={handleCloseEditTitle}
        aria-labelledby="edit-title-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Edit Presentation Title
          </Typography>
          <TextField
            fullWidth
            label="Presentation Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseEditTitle} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveTitle}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={handleCloseDelete}
        aria-labelledby="delete-confirmation-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Are you sure?
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="contained" onClick={handleCloseDelete}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default PresentationEditor;
