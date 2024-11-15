import { useState, useEffect } from "react";
import domtoimage from "dom-to-image";

const ThumbnailPreview = ({ slides }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  useEffect(() => {
    const generateThumbnail = async () => {
      const element = document.createElement("div");
      // 创建用于生成缩略图的 DOM 元素
      element.style.width = "200px";
      element.style.height = "150px";
      element.style.background =
        slides[0]?.background?.type === "color"
          ? slides[0].background.value
          : slides[0]?.background?.type === "gradient"
            ? `linear-gradient(${slides[0].background.value})`
            : slides[0]?.background?.type === "image"
              ? `url(${slides[0].background.value}) center/cover no-repeat`
              : "white";

      try {
        const dataUrl = await domtoimage.toPng(element);
        setThumbnailUrl(dataUrl); // 设置图片 URL
      } catch (error) {
        console.error("Failed to generate thumbnail:", error);
        setThumbnailUrl("default-thumbnail-url"); // 设置默认图片 URL
      }
    };

    generateThumbnail();
  }, [slides]);

  return thumbnailUrl; // 返回字符串形式的 URL
};

export default ThumbnailPreview;
