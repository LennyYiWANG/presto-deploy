import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton, Box, Typography } from "@mui/material";
import { getStore } from "./DataProvide";

const PresentationPreview = () => {
  const { id, slideIndex } = useParams();
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(parseInt(slideIndex, 10) || 0);

  const navigate = useNavigate();

  useEffect(() => {
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          setSlides(data.store[id].slides || []);
        }
      })
      .catch((error) => console.error("Error loading presentation data:", error));
  }, [id]);

  useEffect(() => {
    // 更新 URL 以反映当前的幻灯片编号
    navigate(`/preview/${id}/${currentSlideIndex  + 1}`, { replace: true });
  }, [id, currentSlideIndex, navigate]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background:
          slides[currentSlideIndex]?.background?.type === "color"
            ? slides[currentSlideIndex]?.background?.value
            : slides[currentSlideIndex]?.background?.type === "gradient"
            ? `linear-gradient(${slides[currentSlideIndex]?.background?.value})`
            : `url(${slides[currentSlideIndex]?.background?.value}) center/cover no-repeat`,
        position: "relative",
      }}
    >
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
            fontFamily: element.fontFamily,
          }}
        >
          {element.content}
        </Box>
      ))}

      <Box sx={{ position: "absolute", top: 0, width: "100%", display: "flex", justifyContent: "space-between", p: 2 }}>
        <IconButton onClick={handlePreviousSlide} disabled={currentSlideIndex === 0} color="primary">
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6">
          Slide {currentSlideIndex + 1} of {slides.length}
        </Typography>
        <IconButton onClick={handleNextSlide} disabled={currentSlideIndex === slides.length - 1} color="primary">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PresentationPreview;
