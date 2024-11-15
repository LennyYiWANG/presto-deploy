import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getStore } from "./DataProvide";

const PresentationPreview = () => {
  const { id, slideIndex } = useParams();
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    parseInt(slideIndex, 10) || 0
  );

  const navigate = useNavigate();

  // Get the stored data and set the slide content of the current presentation.
  useEffect(() => {
    getStore()
      .then((data) => {
        if (data.store && data.store[id]) {
          setSlides(data.store[id].slides || []);
        }
      })
      .catch((error) => console.error("Error loading presentation data:", error));
  }, [id]);
  
  // Update the URL to reflect the index of the current slideshow
  useEffect(() => {
    navigate(`/preview/${id}/${currentSlideIndex + 1}`, { replace: true });
  }, [id, currentSlideIndex, navigate]);

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

  return (
    <Box
      sx={{
        width: "93vw",
        height: "93vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        padding: { xs: "10px", sm: "20px" },
      }}
    >
      {/* Content Area with 16:9 Aspect Ratio */}
      <Box
        sx={{
          width: "100%", 
          maxWidth: "100%", 
          aspectRatio: "16 / 9", 
          background:
            slides[currentSlideIndex]?.background?.type === "color"
              ? slides[currentSlideIndex]?.background?.value
              : slides[currentSlideIndex]?.background?.type === "gradient"
              ? `linear-gradient(${slides[currentSlideIndex]?.background?.value})`
              : `url(${slides[currentSlideIndex]?.background?.value}) center/cover no-repeat`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Arrow Navigation Controls */}
        <IconButton
          onClick={handlePreviousSlide}
          disabled={currentSlideIndex === 0}
          color="primary"
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          <ArrowBackIosIcon fontSize="inherit" />
        </IconButton>

        <IconButton
          onClick={handleNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          color="primary"
          sx={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            zIndex: 10,
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>

        {/* Content of the Slide */}
        {slides[currentSlideIndex]?.textElements?.map((element) => (
          <Box
            key={element.id}
            sx={{
              position: "absolute",
              top: `${element.y}%`,
              left: `${element.x}%`,
              width: `${element.width}%`,
              height: `${element.height}%`,
              fontSize: {
                xs: `${element.fontSize * 0.8}em`,
                sm: `${element.fontSize}em`,
              },
              color: element.color,
              fontFamily: element.fontFamily,
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
            }}
            title={image.alt}
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
              fontSize: `${code.fontSize}em`,
              fontFamily: "monospace",
              backgroundColor: "#f5f5f5",
              overflow: "auto",
              padding: "8px",
            }}
          >
            <pre>
              <code className={`language-${code.language}`}>{code.code}</code>
            </pre>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PresentationPreview;
