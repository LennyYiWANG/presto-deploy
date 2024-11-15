import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { getStore } from "./DataProvide";
import domtoimage from "dom-to-image";

const ThumbnailPreview = ({ presentationId, onThumbnailReady }) => {
  const [slides, setSlides] = useState([]);
  const previewRef = useRef(null);

  useEffect(() => {
    getStore()
      .then((data) => {
        if (data.store && data.store[presentationId]) {
          setSlides(data.store[presentationId].slides || []);
        }
      })
      .catch((error) => console.error("Error loading presentation data:", error));
  }, [presentationId]);

  useEffect(() => {
    if (slides.length > 0 && previewRef.current) {
      // Convert the first slide to an image
      domtoimage
        .toPng(previewRef.current)
        .then((dataUrl) => {
          if (onThumbnailReady) {
            onThumbnailReady(dataUrl);
          }
        })
        .catch((error) => console.error("Error generating thumbnail:", error));
    }
  }, [slides, onThumbnailReady]);

  if (slides.length === 0) {
    return <Box>Loading...</Box>;
  }

  const firstSlide = slides[0];

  return (
    <Box
      ref={previewRef}
      sx={{
        width: "300px", // Thumbnail width
        height: "200px", // Thumbnail height
        background:
          firstSlide?.background?.type === "color"
            ? firstSlide?.background?.value
            : firstSlide?.background?.type === "gradient"
            ? `linear-gradient(${firstSlide?.background?.value})`
            : `url(${firstSlide?.background?.value}) center/cover no-repeat`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Render text elements */}
      {firstSlide?.textElements?.map((element) => (
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

      {/* Render image elements */}
      {firstSlide?.imageElements?.map((image) => (
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

      {/* Render video elements */}
      {firstSlide?.videoElements?.map((video) => (
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

      {/* Render code elements */}
      {firstSlide?.codeElements?.map((code) => (
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
  );
};

export default ThumbnailPreview;
