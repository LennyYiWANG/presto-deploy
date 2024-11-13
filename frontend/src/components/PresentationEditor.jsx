import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button, IconButton, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getStore } from './DataProvide';

const PresentationEditor = () => {
  const { id } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditTitleModal, setOpenEditTitleModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [openTextModal, setOpenTextModal] = useState(false);
  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [newText, setNewText] = useState({
    width: 50,
    height: 20,
    content: '',
    fontSize: 1,
    color: '#000000',
    x: 0,
    y: 0,
  });
  const [isPositionEditable, setIsPositionEditable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getStore().then(data => {
      if (data.store && data.store[id]) {
        setTitle(data.store[id].title || 'Untitled');
        setSlides(Array.isArray(data.store[id].slides) ? data.store[id].slides : []);
      }
    });
  }, [id]);

  const handleOpenDelete = () => setOpenDeleteModal(true);
  const handleCloseDelete = () => setOpenDeleteModal(false);
  const handleOpenEditTitle = () => setOpenEditTitleModal(true);
  const handleCloseEditTitle = () => setOpenEditTitleModal(false);
  const handleOpenError = () => setOpenErrorModal(true);
  const handleCloseError = () => setOpenErrorModal(false);

  const handleOpenTextModal = (element = null) => {
    if (element) {
      setSelectedElement(element);
      setNewText(element);
      setIsPositionEditable(true); // 仅在编辑时允许位置编辑
    } else {
      setSelectedElement(null);
      setNewText({
        width: 50,
        height: 20,
        content: '',
        fontSize: 1,
        color: '#000000',
        x: 0,
        y: 0,
      });
      setIsPositionEditable(false); // 新建时禁用位置编辑
    }
    setOpenTextModal(true);
  };

  const handleCloseTextModal = () => setOpenTextModal(false);

  const handleDeleteSlide = () => {
    if (slides.length === 1) {
      handleOpenError();
      return;
    }
    const updatedSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(updatedSlides);
    setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0));

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
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
        if (!response.ok) throw new Error('Failed to delete the slide.');
        console.log("Slide deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

  const handleCreateSlide = () => {
    const updatedSlides = [...(Array.isArray(slides) ? slides : []), { textElements: [] }];
    setSlides(updatedSlides);
    setCurrentSlideIndex(updatedSlides.length - 1);

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
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
        if (!response.ok) throw new Error('Failed to save the new slide.');
        console.log("New slide saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleAddOrUpdateText = () => {
    const updatedSlides = [...slides];
    if (selectedElement) {
      updatedSlides[currentSlideIndex].textElements = updatedSlides[currentSlideIndex].textElements.map(el => 
        el.id === selectedElement.id ? newText : el
      );
    } else {
      const newTextElement = { ...newText, id: Date.now(), x: 0, y: 0 }; // 新元素默认位置在左上角
      updatedSlides[currentSlideIndex].textElements = [
        ...(updatedSlides[currentSlideIndex].textElements || []),
        newTextElement,
      ];
    }
    setSlides(updatedSlides);
    handleCloseTextModal();

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
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
        if (!response.ok) throw new Error('Failed to save the new text element.');
        console.log("Text element saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteTextElement = (id) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].textElements = updatedSlides[currentSlideIndex].textElements.filter(el => el.id !== id);
    setSlides(updatedSlides);

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
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
        if (!response.ok) throw new Error('Failed to delete the text element.');
        console.log("Text element deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ marginTop: '5rem', position: 'relative' }}>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/dashboard')} 
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        Back
      </Button>
      <Box display="flex" alignItems="center" justifyContent="center" style={{ marginBottom: '1rem' }}>
        <Typography variant="h4" component="h1" textAlign="center">
          {title}
        </Typography>
        <IconButton onClick={handleOpenEditTitle} aria-label="edit title" sx={{ ml: 1 }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleOpenDelete} aria-label="delete presentation" color="error" sx={{ ml: 1 }}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Button variant="contained" color="primary" onClick={() => handleOpenTextModal()}>
        Add Text Box
      </Button>

      <Modal
        open={openTextModal}
        onClose={handleCloseTextModal}
        aria-labelledby="text-modal"
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
          <Typography variant="h6" component="h2">Add or Edit Text Box</Typography>
          <TextField
            label="Text Content"
            fullWidth
            value={newText.content}
            onChange={(e) => setNewText({ ...newText, content: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Width (%)"
            fullWidth
            type="number"
            value={newText.width}
            onChange={(e) => setNewText({ ...newText, width: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Height (%)"
            fullWidth
            type="number"
            value={newText.height}
            onChange={(e) => setNewText({ ...newText, height: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Font Size (em)"
            fullWidth
            type="number"
            value={newText.fontSize}
            onChange={(e) => setNewText({ ...newText, fontSize: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Text Color (#hex)"
            fullWidth
            value={newText.color}
            onChange={(e) => setNewText({ ...newText, color: e.target.value })}
            sx={{ mt: 2 }}
          />
          {isPositionEditable && (
            <>
              <TextField
                label="X Position (%)"
                fullWidth
                type="number"
                value={newText.x}
                onChange={(e) => setNewText({ ...newText, x: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Y Position (%)"
                fullWidth
                type="number"
                value={newText.y}
                onChange={(e) => setNewText({ ...newText, y: e.target.value })}
                sx={{ mt: 2 }}
              />
            </>
          )}
          <Button onClick={handleAddOrUpdateText} variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Text
          </Button>
        </Box>
      </Modal>

      <div style={{ width: '100%', height: '500px', border: '1px solid black', marginTop: '1rem', position: 'relative' }}>
        {slides[currentSlideIndex]?.textElements?.map((element) => (
          <Box
            key={element.id}
            sx={{
              position: 'absolute',
              top: `${element.y}%`,
              left: `${element.x}%`,
              width: `${element.width}%`,
              height: `${element.height}%`,
              fontSize: `${element.fontSize}em`,
              color: element.color,
              border: '1px solid lightgray',
              padding: '4px',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            onDoubleClick={() => handleOpenTextModal(element)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteTextElement(element.id);
            }}
          >
            {element.content}
          </Box>
        ))}
      </div>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <IconButton
          onClick={handlePreviousSlide}
          disabled={currentSlideIndex === 0}
          color="primary"
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Button onClick={handleCreateSlide} variant="contained" color="primary" sx={{ mx: 2 }}>
          Add New Slide
        </Button>
        <IconButton
          onClick={handleNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          color="primary"
        >
          <ArrowForwardIosIcon />
        </IconButton>
        <Button onClick={handleDeleteSlide} variant="contained" color="error" sx={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          Delete Slide
        </Button>
      </Box>
    </div>
  );
};

export default PresentationEditor;
