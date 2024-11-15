import { useState, useEffect } from 'react';
import { Button, Box, Modal, TextField, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { getStore } from './DataProvide';
import MediaCard from './MediaCard';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [presentationName, setPresentationName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  // Style object for modal display
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: '90vw', 
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Function to add a new presentation
  const postNew = (title, description) => {
    getStore()
      .then((data) => {
        const storeData = data.store && typeof data.store === 'object' ? data.store : {};
        const maxId = Math.max(0, ...Object.keys(storeData).map(id => parseInt(id, 10)));
        const newId = maxId + 1;

        storeData[newId] = { title, description, slides: [{}] };

        const userToken = localStorage.getItem('token');
        const url = 'http://localhost:5005/store';

        return fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: storeData }),
        });
      })
      .then((res) => {
        if (res.ok) {
          console.log("Data updated successfully!");
          fetchPresentations();
        } else {
          console.error("Failed to update data.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  // Handle the creation of a new presentation when form is submitted
  const handleCreatePresentation = () => {
    if (presentationName.trim() === '') return;
    postNew(presentationName, description);
    setPresentationName('');
    setDescription('');
    handleClose();
  };

  // Fetches all presentations from the store and sets them in state
  const fetchPresentations = () => {
    getStore()
      .then((data) => {
        const storeData = data.store && typeof data.store === 'object' ? data.store : {};
        const presentationList = Object.entries(storeData).map(([id, item]) => ({
          id,
          name: item.title || `Presentation ${id}`,
          description: item.description || '',
          slides: item.slides || [],
          slidesCount: item.slides ? Object.keys(item.slides).length : 0,
        }));
        setPresentations(presentationList);
      })
      .catch((error) => console.error("Failed to fetch presentations:", error));
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handlePresentationClick = (id) => {
    navigate(`/editor/${id}/0`);
  };

  return (
    <div style={{ marginTop: '5rem', textAlign: 'center' }}>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        New Presentation
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
            Create New Presentation
          </Typography>
          <TextField
            fullWidth
            label="Presentation Name"
            variant="outlined"
            value={presentationName}
            onChange={(e) => setPresentationName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePresentation}
            sx={{ mt: 2 }}
            fullWidth
          >
            Create
          </Button>
        </Box>
      </Modal>

      <Box
        mt={4}
        display="flex"
        flexWrap="wrap"
        gap={2}
        sx={{
          justifyContent: 'center',
          '@media (max-width: 400px)': {
            flexDirection: 'column', 
            alignItems: 'center',
          },
        }}
      >
        {presentations.map((presentation) => (
          <Box
            key={presentation.id}
            width="45%"
            onClick={() => handlePresentationClick(presentation.id)}
            sx={{
              '@media (max-width: 400px)': {
                width: '90%', 
              },
            }}
          >
            <MediaCard
              name={presentation.name}
              description={presentation.description}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Dashboard;
