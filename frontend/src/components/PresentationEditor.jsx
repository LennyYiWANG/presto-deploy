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
  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getStore().then(data => {
      if (data.store && data.store[id]) {
        setTitle(data.store[id].title || 'Untitled');
        setSlides(Array.isArray(data.store[id].slides) ? data.store[id].slides : []);
      }
    });
  }, [id]);

  const [openTextModal, setOpenTextModal] = useState(false); // 新增，用于文本框编辑模态框的状态管理
const [selectedElement, setSelectedElement] = useState(null); // 新增，当前选中的文本元素，用于编辑特定文本框
const [newText, setNewText] = useState({
  width: 50,
  height: 20,
  content: '',
  fontSize: 1,
  color: '#000000',
  x: 0,
  y: 0,
}); // 新增，存储文本框的宽度、高度、内容、字体大小、颜色以及初始位置

const [isPositionEditable, setIsPositionEditable] = useState(false); // 新增，用于控制位置编辑框显示（仅编辑模式）

  const handleOpenDelete = () => setOpenDeleteModal(true);
  const handleCloseDelete = () => setOpenDeleteModal(false);
  const handleOpenEditTitle = () => setOpenEditTitleModal(true);
  const handleCloseEditTitle = () => setOpenEditTitleModal(false);
  const handleOpenError = () => setOpenErrorModal(true);
  const handleCloseError = () => setOpenErrorModal(false);

  const handleOpenTextModal = (element = null) => {
    if (element) {
      setSelectedElement(element); // 如果传入了元素，设置为当前选中的文本框
      setNewText(element); // 设置为已存在的文本框内容
      setIsPositionEditable(true); // 启用位置编辑
    } else {
      setSelectedElement(null); // 没有传入元素则表示新增文本框
      setNewText({
        width: 50,
        height: 20,
        content: '',
        fontSize: 1,
        color: '#000000',
        x: 0,
        y: 0,
      }); // 初始化新文本框内容
      setIsPositionEditable(false); // 禁用位置编辑
    }
    setOpenTextModal(true); // 打开文本模态框
  };
  const handleCloseTextModal = () => setOpenTextModal(false); // 新增，关闭文本模态框
  

  const handleDeleteSlide = () => {
    if (slides.length === 1) {
      // If only one slide exists, prompt the user to delete the entire presentation
      handleOpenError();
      return;
    }

    const updatedSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(updatedSlides);

    setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0));

    // Update the slides in the database
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
    const updatedSlides = [...(Array.isArray(slides) ? slides : []), { textElements: [] }]; // 为新幻灯片初始化空的文本元素数组
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePreviousSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);


  const handleAddOrUpdateText = () => {
    const updatedSlides = [...slides];
    if (selectedElement) {
      updatedSlides[currentSlideIndex].textElements = updatedSlides[currentSlideIndex].textElements.map(el => 
        el.id === selectedElement.id ? newText : el
      ); // 更新选中元素的内容
    } else {
      const newTextElement = { ...newText, id: Date.now(), x: 0, y: 0 }; // 为新文本框设置唯一ID和默认位置
      updatedSlides[currentSlideIndex].textElements = [
        ...(updatedSlides[currentSlideIndex].textElements || []),
        newTextElement,
      ]; // 将新文本框添加到当前幻灯片的文本元素列表
    }
    setSlides(updatedSlides); // 更新幻灯片内容
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
    updatedSlides[currentSlideIndex].textElements = updatedSlides[currentSlideIndex].textElements.filter(el => el.id !== id); // 从当前幻灯片的文本元素列表中移除选中的文本框
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
  

    //image element adding
    const [openImageModal, setOpenImageModal] = useState(false); // 控制图像模态框显示
    const [selectedImage, setSelectedImage] = useState(null); // 当前选择的图像
    const [newImage, setNewImage] = useState({
    width: 50,
    height: 30,
    url: '',
    alt: 'Description',
    x: 0,
    y: 0,
    }); // 图像的默认属性

const handleOpenImageModal = (element = null) => {
    if (element) {
      setSelectedElement(element);
      setNewImage(element);
      setIsPositionEditable(true); // 启用位置编辑
    } else {
      setSelectedElement(null);
      setNewImage({
        width: 50,
        height: 20,
        url: '',
        alt: '',
        x: 0,
        y: 0,
      });
      setIsPositionEditable(false); // 禁用位置编辑
    }
    setOpenImageModal(true);
  };
  

const handleCloseImageModal = () => setOpenImageModal(false);
const handleAddOrUpdateImage = () => {
    const updatedSlides = [...slides];
    if (selectedImage) {
      updatedSlides[currentSlideIndex].imageElements = updatedSlides[currentSlideIndex].imageElements.map(img =>
        img.id === selectedImage.id ? newImage : img
      );
    } else {
      const newImageElement = { ...newImage, id: Date.now(), x: 0, y: 0 };
      updatedSlides[currentSlideIndex].imageElements = [
        ...(updatedSlides[currentSlideIndex].imageElements || []),
        newImageElement,
      ];
    }
    setSlides(updatedSlides);
    handleCloseImageModal();
  
    // 保存到数据库
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
        if (!response.ok) throw new Error('Failed to save the image element.');
        console.log("Image element saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteImageElement = (id) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].imageElements = updatedSlides[currentSlideIndex].imageElements.filter(img => img.id !== id);
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
        if (!response.ok) throw new Error('Failed to delete the image element.');
        console.log("Image element deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // 更新 `newImage` 的 URL 为 base64 编码
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage({ ...newImage, url: reader.result });
      };
      reader.readAsDataURL(file); // 将文件转换为 base64
    }
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
      <Button variant="contained" color="primary" onClick={() => handleOpenImageModal()}>
        Add Image
      </Button>


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

      <Modal open={openErrorModal} onClose={handleCloseError} aria-labelledby="error-modal">
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
            Cannot delete the only slide.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            To delete this presentation, please click the icon next to the title.
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseError}>
              OK
            </Button>
          </Box>
        </Box>
      </Modal>

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
            <Typography variant="h6" component="h2">Text Box</Typography>
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
        {/* <Typography variant="h5" align="center">
          Slide {currentSlideIndex + 1} of {slides.length}
        </Typography> */}
        <Button onClick={handleDeleteSlide} variant="contained" color="error" sx={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          Delete Slide
        </Button>
        
        <Box
            sx={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
                color: 'white',
                fontSize: '1em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
            }}
        >
            {currentSlideIndex + 1}
        </Box>

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
            onDoubleClick={() => handleOpenTextModal(element)} // 双击编辑
            onContextMenu={(e) => {
                e.preventDefault();
                handleDeleteTextElement(element.id); // 右键删除文本框
            }}
            >
            {element.content}
        </Box>
        ))}

        {slides[currentSlideIndex]?.imageElements?.map((image) => (
        <Box
            key={image.id}
            sx={{
            position: 'absolute',
            top: `${image.y}%`,
            left: `${image.x}%`,
            width: `${image.width}%`,
            height: `${image.height}%`,
            backgroundImage: `url(${image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid lightgray',
            cursor: 'pointer',
            }}
            onDoubleClick={() => handleOpenImageModal(image)}
            onContextMenu={(e) => {
            e.preventDefault();
            handleDeleteImageElement(image.id);
            }}
            title={image.alt} // Alt text
        />
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
      </Box>
    </div>
  );
};

export default PresentationEditor;
