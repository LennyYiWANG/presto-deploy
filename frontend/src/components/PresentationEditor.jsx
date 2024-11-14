import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Select, MenuItem } from "@mui/material";
import { getStore } from "./DataProvide";

const PresentationEditor = () => {
  const { id } = useParams();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditTitleModal, setOpenEditTitleModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [openFontModal, setOpenFontModal] = useState(false);
  const [openBackgroundModal, setOpenBackgroundModal] = useState(false);
  const [currentBackground, setCurrentBackground] = useState({
    type: "color",
    value: "#ffffff",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getStore().then((data) => {
      if (data.store && data.store[id]) {
        setTitle(data.store[id].title || "Untitled");
        setSlides(
          Array.isArray(data.store[id].slides) ? data.store[id].slides : []
        );
      }
    });
  }, [id]);

  const [openTextModal, setOpenTextModal] = useState(false); // 新增，用于文本框编辑模态框的状态管理
  const [selectedElement, setSelectedElement] = useState(null); // 新增，当前选中的文本元素，用于编辑特定文本框
  const [newText, setNewText] = useState({
    width: 50,
    height: 20,
    content: "",
    fontSize: 1,
    color: "#000000",
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
        content: "",
        fontSize: 1,
        color: "#000000",
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

    const updatedSlides = slides.filter(
      (_, index) => index !== currentSlideIndex
    );
    setSlides(updatedSlides);

    setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0));

    // Update the slides in the database
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete the slide.");
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
        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update the presentation.");
        console.log(`Presentation with ID ${id} deleted`);
        navigate("/dashboard");
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

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save the title.");
        console.log(`Presentation with ID ${id} title updated to ${title}`);
        handleCloseEditTitle();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCreateSlide = () => {
    const updatedSlides = [
      ...(Array.isArray(slides) ? slides : []),
      { textElements: [], imageElements: [] },
    ]; // 为新幻灯片初始化空的文本元素数组
    setSlides(updatedSlides);
    setCurrentSlideIndex(updatedSlides.length - 1);

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save the new slide.");
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
      if (e.key === "ArrowRight") handleNextSlide();
      if (e.key === "ArrowLeft") handlePreviousSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex]);

  const handleAddOrUpdateText = () => {
    const updatedSlides = [...slides];
    if (selectedElement) {
      updatedSlides[currentSlideIndex].textElements = updatedSlides[
        currentSlideIndex
      ].textElements.map((el) => (el.id === selectedElement.id ? newText : el)); // 更新选中元素的内容
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

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok)
          throw new Error("Failed to save the new text element.");
        console.log("Text element saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteTextElement = (id) => {
    const updatedSlides = JSON.parse(JSON.stringify(slides)); // 深拷贝 slides
    updatedSlides[currentSlideIndex].textElements = updatedSlides[
      currentSlideIndex
    ].textElements.filter((el) => el.id !== id);
    console.log("Updated slides:", updatedSlides);

    setSlides(updatedSlides);

    getStore()
      .then((data) => {
        console.log("Request body:", JSON.stringify({ store: data.store }));
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Complete server response:", JSON.stringify(data, null, 2));
        console.log("Server response after deleting text element:", data);
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
    url: "",
    alt: "Description",
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
        url: "",
        alt: "",
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
      updatedSlides[currentSlideIndex].imageElements = updatedSlides[
        currentSlideIndex
      ].imageElements.map((img) =>
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

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save the image element.");
        console.log("Image element saved successfully!");
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

  const handleDeleteImageElement = (id) => {
    // 直接修改 slides 数组
    slides[currentSlideIndex].imageElements = slides[
      currentSlideIndex
    ].imageElements.filter((img) => img.id !== id);
    setSlides([...slides]); // 更新状态

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = slides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response after deleting image element:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //vedio upload
  // State management for video element
  const [openVideoModal, setOpenVideoModal] = useState(false); // 控制视频模态框显示
  const [selectedVideo, setSelectedVideo] = useState(null); // 当前选择的视频
  const [newVideo, setNewVideo] = useState({
    width: 50,
    height: 30,
    url: "",
    autoplay: false,
    x: 0,
    y: 0,
  }); // 视频的默认属性

  const handleOpenVideoModal = (element = null) => {
    if (element) {
      setSelectedElement(element);
      setNewVideo(element);
      setIsPositionEditable(true); // 启用位置编辑
    } else {
      setSelectedElement(null);
      setNewVideo({
        width: 50,
        height: 30,
        url: "",
        autoplay: false,
        x: 0,
        y: 0,
      });
      setIsPositionEditable(false); // 禁用位置编辑
    }
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => setOpenVideoModal(false);

  const handleAddOrUpdateVideo = () => {
    const updatedSlides = [...slides];
    if (selectedVideo) {
      updatedSlides[currentSlideIndex].videoElements = updatedSlides[
        currentSlideIndex
      ].videoElements.map((vid) =>
        vid.id === selectedVideo.id ? newVideo : vid
      );
    } else {
      const newVideoElement = { ...newVideo, id: Date.now(), x: 0, y: 0 };
      updatedSlides[currentSlideIndex].videoElements = [
        ...(updatedSlides[currentSlideIndex].videoElements || []),
        newVideoElement,
      ];
    }
    setSlides(updatedSlides);
    handleCloseVideoModal();

    // 保存到数据库
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save the video element.");
        console.log("Video element saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeleteVideoElement = (id) => {
    slides[currentSlideIndex].videoElements = slides[
      currentSlideIndex
    ].videoElements.filter((vid) => vid.id !== id);
    setSlides([...slides]); // 更新状态

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = slides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response after deleting video element:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // State management for code element
  const [openCodeModal, setOpenCodeModal] = useState(false); // 控制代码模态框显示
  const [selectedCode, setSelectedCode] = useState(null); // 当前选择的代码块
  const [newCode, setNewCode] = useState({
    width: 50,
    height: 30,
    code: "",
    fontSize: 1,
    language: "javascript",
    x: 0,
    y: 0,
  }); // 代码块的默认属性

  // 打开和关闭代码模态框
  const handleOpenCodeModal = (element = null) => {
    if (element) {
      setSelectedCode(element);
      setNewCode(element);
      setIsPositionEditable(true); // 启用位置编辑
    } else {
      setSelectedCode(null);
      setNewCode({
        width: 50,
        height: 30,
        code: "",
        fontSize: 1,
        language: "javascript",
        x: 0,
        y: 0,
      });
      setIsPositionEditable(false); // 禁用位置编辑
    }
    setOpenCodeModal(true);
  };

  const handleCloseCodeModal = () => setOpenCodeModal(false);

  const handleAddOrUpdateCode = () => {
    const updatedSlides = [...slides];
    if (selectedCode) {
      updatedSlides[currentSlideIndex].codeElements = updatedSlides[
        currentSlideIndex
      ].codeElements.map((code) =>
        code.id === selectedCode.id ? newCode : code
      );
    } else {
      const newCodeElement = { ...newCode, id: Date.now(), x: 0, y: 0 };
      updatedSlides[currentSlideIndex].codeElements = [
        ...(updatedSlides[currentSlideIndex].codeElements || []),
        newCodeElement,
      ];
    }
    setSlides(updatedSlides);
    handleCloseCodeModal();

    // 保存到数据库
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = updatedSlides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save the code element.");
        console.log("Code element saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // 删除代码块
  const handleDeleteCodeElement = (id) => {
    slides[currentSlideIndex].codeElements = slides[
      currentSlideIndex
    ].codeElements.filter((code) => code.id !== id);
    setSlides([...slides]);

    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          data.store[id].slides = slides;
        }

        const userToken = localStorage.getItem("token");
        const url = "http://localhost:5005/store";

        return fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ store: data.store }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response after deleting code element:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFontChange = (event) => {
    const selectedFont = event.target.value;
    setFontFamily(selectedFont);

    getStore().then((data) => {
      if (data.store && data.store[id]) {
        data.store[id].fontFamily = selectedFont;
      }

      const userToken = localStorage.getItem("token");
      const url = "http://localhost:5005/store";

      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ store: data.store }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("字体更新失败");
          console.log("字体更新成功！");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  //Background setting function
  const applyBackground = () => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].background = currentBackground;
    setSlides(updatedSlides);
    setOpenBackgroundModal(false);

    getStore().then((data) => {
      if (data.store && data.store[id]) {
        data.store[id].slides = updatedSlides;
      }
      const userToken = localStorage.getItem("token");
      const url = "http://localhost:5005/store";

      fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ store: data.store }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update background.");
          console.log("Background updated successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  return (
    <div style={{ marginTop: "5rem", position: "relative" }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/dashboard")}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        Back
      </Button>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ marginBottom: "1rem" }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          {title}
        </Typography>
        <IconButton
          onClick={handleOpenEditTitle}
          aria-label="edit title"
          sx={{ ml: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={handleOpenDelete}
          aria-label="delete presentation"
          color="error"
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenBackgroundModal(true)}
        sx={{ mx: 2 }}
      >
        Choose Background
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenFontModal(true)}
        sx={{ mx: 2 }}
      >
        Choose Font
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenTextModal()}
      >
        Add Text Box
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenImageModal()}
      >
        Add Image
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenVideoModal()}
      >
        Add Video
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenCodeModal()}
      >
        Add Code Block
      </Button>

      <Modal
        open={openEditTitleModal}
        onClose={handleCloseEditTitle}
        aria-labelledby="edit-title-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTitle}
            >
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
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

      <Modal
        open={openErrorModal}
        onClose={handleCloseError}
        aria-labelledby="error-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Cannot delete the only slide.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            To delete this presentation, please click the icon next to the
            title.
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Text Box
          </Typography>
          <TextField
            label="Text Content"
            fullWidth
            value={newText.content}
            onChange={(e) =>
              setNewText({ ...newText, content: e.target.value })
            }
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
            onChange={(e) =>
              setNewText({ ...newText, fontSize: e.target.value })
            }
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
          <Button
            onClick={handleAddOrUpdateText}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Text
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openImageModal}
        onClose={handleCloseImageModal}
        aria-labelledby="image-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Image Properties
          </Typography>
          <TextField
            label="Image URL or Upload"
            fullWidth
            value={newImage.url}
            onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
            sx={{ mt: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "16px" }}
          />

          <TextField
            label="Description"
            fullWidth
            value={newImage.alt}
            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Width (%)"
            fullWidth
            type="number"
            value={newImage.width}
            onChange={(e) =>
              setNewImage({ ...newImage, width: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Height (%)"
            fullWidth
            type="number"
            value={newImage.height}
            onChange={(e) =>
              setNewImage({ ...newImage, height: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          {isPositionEditable && (
            <>
              <TextField
                label="X Position (%)"
                fullWidth
                type="number"
                value={newImage.x}
                onChange={(e) =>
                  setNewImage({ ...newImage, x: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                label="Y Position (%)"
                fullWidth
                type="number"
                value={newImage.y}
                onChange={(e) =>
                  setNewImage({ ...newImage, y: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </>
          )}
          <Button
            onClick={handleAddOrUpdateImage}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Image
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openVideoModal}
        onClose={handleCloseVideoModal}
        aria-labelledby="video-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Video Properties
          </Typography>
          <TextField
            label="Video URL"
            fullWidth
            value={newVideo.url}
            onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Width (%)"
            fullWidth
            type="number"
            value={newVideo.width}
            onChange={(e) =>
              setNewVideo({ ...newVideo, width: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Height (%)"
            fullWidth
            type="number"
            value={newVideo.height}
            onChange={(e) =>
              setNewVideo({ ...newVideo, height: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={newVideo.autoplay}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, autoplay: e.target.checked })
                }
              />
              Autoplay
            </label>
          </Box>
          {isPositionEditable && (
            <>
              <TextField
                label="X Position (%)"
                fullWidth
                type="number"
                value={newVideo.x}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, x: e.target.value })
                }
                sx={{ mt: 2 }}
              />
              <TextField
                label="Y Position (%)"
                fullWidth
                type="number"
                value={newVideo.y}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, y: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </>
          )}
          <Button
            onClick={handleAddOrUpdateVideo}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Video
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openCodeModal}
        onClose={handleCloseCodeModal}
        aria-labelledby="code-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Code Block Properties
          </Typography>
          <TextField
            label="Code"
            fullWidth
            multiline
            minRows={4}
            value={newCode.code}
            onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
            sx={{ mt: 2, fontFamily: "monospace" }}
          />
          <TextField
            label="Width (%)"
            fullWidth
            type="number"
            value={newCode.width}
            onChange={(e) => setNewCode({ ...newCode, width: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Height (%)"
            fullWidth
            type="number"
            value={newCode.height}
            onChange={(e) => setNewCode({ ...newCode, height: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Font Size (em)"
            fullWidth
            type="number"
            value={newCode.fontSize}
            onChange={(e) =>
              setNewCode({ ...newCode, fontSize: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            select
            label="Language"
            value={newCode.language}
            onChange={(e) =>
              setNewCode({ ...newCode, language: e.target.value })
            }
            sx={{ mt: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
          </TextField>
          {isPositionEditable && (
            <>
              <TextField
                label="X Position (%)"
                fullWidth
                type="number"
                value={newCode.x}
                onChange={(e) => setNewCode({ ...newCode, x: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Y Position (%)"
                fullWidth
                type="number"
                value={newCode.y}
                onChange={(e) => setNewCode({ ...newCode, y: e.target.value })}
                sx={{ mt: 2 }}
              />
            </>
          )}
          <Button
            onClick={handleAddOrUpdateCode}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Code
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openFontModal}
        onClose={() => setOpenFontModal(false)}
        aria-labelledby="font-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Choose Font
          </Typography>
          <Select
            fullWidth
            value={fontFamily}
            onChange={handleFontChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
          </Select>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpenFontModal(false)}>关闭</Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openBackgroundModal}
        onClose={() => setOpenBackgroundModal(false)}
        aria-labelledby="background-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Select Slide Background
          </Typography>

          <Select
            fullWidth
            value={currentBackground.type}
            onChange={(e) =>
              setCurrentBackground({
                ...currentBackground,
                type: e.target.value,
              })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="color">Solid Color</MenuItem>
            <MenuItem value="gradient">Gradient</MenuItem>
            <MenuItem value="image">Image</MenuItem>
          </Select>

          {currentBackground.type === "color" && (
            <TextField
              label="Color"
              type="color"
              fullWidth
              value={currentBackground.value}
              onChange={(e) =>
                setCurrentBackground({
                  ...currentBackground,
                  value: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}

          {currentBackground.type === "gradient" && (
            <TextField
              label="Gradient (e.g., 'to right, #ff0000, #0000ff')"
              fullWidth
              value={currentBackground.value}
              onChange={(e) =>
                setCurrentBackground({
                  ...currentBackground,
                  value: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}

          {currentBackground.type === "image" && (
            <TextField
              label="Image URL"
              fullWidth
              value={currentBackground.value}
              onChange={(e) =>
                setCurrentBackground({
                  ...currentBackground,
                  value: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpenBackgroundModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => applyBackground()}
              sx={{ ml: 2 }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>

      <div
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid black",
          marginTop: "1rem",
          position: "relative",
          background:
            currentBackground.type === "color"
              ? currentBackground.value
              : currentBackground.type === "gradient"
              ? `linear-gradient(${currentBackground.value})`
              : `url(${currentBackground.value}) center/cover no-repeat`,
        }}
      >
        {/* <Typography variant="h5" align="center">
          Slide {currentSlideIndex + 1} of {slides.length}
        </Typography> */}
        <Button
          onClick={handleDeleteSlide}
          variant="contained"
          color="error"
          sx={{ position: "absolute", bottom: "10px", right: "10px" }}
        >
          Delete Slide
        </Button>

        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            width: "50px",
            height: "50px",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
            color: "white",
            fontSize: "1em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "5px",
          }}
        >
          {currentSlideIndex + 1}
        </Box>

        {slides[currentSlideIndex]?.textElements?.map((element) => (
          <Box
            key={element.id}
            sx={{
              position: "absolute",
              top: `${element.y}%`,
              left: `${element.x}%`,
              width: `${element.width}%`,
              height: `${element.height}%`,
              fontSize: `${element.fontSize}em`,
              color: element.color,
              fontFamily: fontFamily,
              border: "1px solid lightgray",
              padding: "4px",
              cursor: "pointer",
              overflow: "hidden",
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

        {slides[currentSlideIndex]?.imageElements?.map((image) => (
          <Box
            key={image.id}
            sx={{
              position: "absolute",
              top: `${image.y}%`,
              left: `${image.x}%`,
              width: `${image.width}%`,
              height: `${image.height}%`,
              backgroundImage: `url(${image.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid lightgray",
              cursor: "pointer",
            }}
            onDoubleClick={() => handleOpenImageModal(image)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteImageElement(image.id);
            }}
            title={image.alt} // Alt text
          />
        ))}

        {slides[currentSlideIndex]?.videoElements?.map((video) => (
          <Box
            key={video.id}
            sx={{
              position: "absolute",
              top: `${video.y}%`,
              left: `${video.x}%`,
              width: `${video.width}%`,
              height: `${video.height}%`,
              border: "1px solid lightgray",
              cursor: "pointer",
            }}
            onDoubleClick={() => handleOpenVideoModal(video)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteVideoElement(video.id);
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`${video.url}${video.autoplay ? "&autoplay=1" : ""}`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </Box>
        ))}

        {slides[currentSlideIndex]?.codeElements?.map((code) => (
          <Box
            key={code.id}
            sx={{
              position: "absolute",
              top: `${code.y}%`,
              left: `${code.x}%`,
              width: `${code.width}%`,
              height: `${code.height}%`,
              overflow: "auto",
              fontSize: `${code.fontSize}em`,
              fontFamily: "monospace",
              border: "1px solid lightgray",
              padding: "8px",
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
            }}
            onDoubleClick={() => handleOpenCodeModal(code)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleDeleteCodeElement(code.id);
            }}
          >
            <pre>
              <code className={`language-${code.language}`}>{code.code}</code>
            </pre>
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
        <Button
          onClick={handleCreateSlide}
          variant="contained"
          color="primary"
          sx={{ mx: 2 }}
        >
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
