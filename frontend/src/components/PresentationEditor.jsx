import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button } from "@mui/material";
import { getStore } from './DataProvide';

const PresentationEditor = () => {
  const { id } = useParams(); // 获取id参数
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();

//   console.log("Presentation ID:", id); // 检查是否正确获取到ID

  const handleOpen = () => setOpenDeleteModal(true);
  const handleClose = () => setOpenDeleteModal(false);

  // 删除演示文稿并返回到仪表板
  const handleDelete = () => {
    getStore()
      .then((data) => {
        // 删除指定 ID 的演示文稿
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
        navigate('/dashboard'); // 删除后返回到仪表板
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ marginTop: '5rem' }}>
      <Typography variant="h4" component="h1">
        Editing Presentation: {id}
      </Typography>
      <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard')}>
        Back
      </Button>
      <Button variant="contained" color="error" onClick={handleOpen}>
        Delete Presentation
      </Button>

      <Modal
        open={openDeleteModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="contained" onClick={handleClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default PresentationEditor;
