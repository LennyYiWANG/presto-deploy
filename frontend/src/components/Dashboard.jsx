import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";
import { Card, CardContent, Typography, Box, Modal, TextField } from "@mui/material";
import { getStore } from './DataProvide';
import MediaCard from './MediaCard';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [presentations, setPresentations] = useState([]);
  const [presentationName, setPresentationName] = useState('');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const postNew = (title) => {
    getStore()
      .then((data) => {
        // 获取当前 store 数据，确保为对象类型
        const storeData = data.store && typeof data.store === 'object' ? data.store : {};
        
        // 使用自动增量的 ID 作为新演示文稿的键
        const newId = Object.keys(storeData).length + 1;
        storeData[newId] = { "title": title, "slides": {} };
  
        // PUT 新数据到数据库
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
  

  const handleCreatePresentation = () => {
    if (presentationName.trim() === '') return;

    // 创建新的演示对象
    const newPresentation = {
      name: presentationName,
      slides: [{}] // 默认情况下只有一个空白幻灯片
    };

    // 更新状态，添加新演示到本地的演示列表
    setPresentations([...presentations, newPresentation]);

    // 调用 postNew 将新演示发送到服务器
    postNew(presentationName);

    // 重置表单和关闭模态框
    setPresentationName('');
    handleClose();
  };

  const fetchPresentations = () => {
    getStore()
      .then((data) => {
        const storeData = data.store && typeof data.store === 'object' ? data.store : {};
        const presentationList = Object.values(storeData).map((item, index) => ({
          name: item.title || `Presentation ${index + 1}`,
          description: item.description || '',
          thumbnail: item.thumbnail || '',
          slidesCount: item.slides ? Object.keys(item.slides).length : 0,
        }));
        setPresentations(presentationList);
      })
      .catch((error) => console.error("获取演示数据失败:", error));
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  return (
    <div style={{ marginTop: '5rem' }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        New Presentation
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
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

      {/* 显示已创建的演示文稿列表 */}
      <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
        {presentations.map((presentation, index) => (
          <Box key={index} width="45%">
            <MediaCard
              name={presentation.name}
              description={presentation.description}
              thumbnail={presentation.thumbnail}
              slidesCount={presentation.slidesCount}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default Dashboard;
