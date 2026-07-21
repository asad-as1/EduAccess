import axios from "axios";
import Cookies from "cookies-js";

const getToken = () => Cookies.get("user");

const getCloudinaryBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/cloudinary`;
};

const extractPublicId = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      return value;
    }

    const tail = parts.slice(uploadIndex + 1);
    const withoutVersion = tail[0]?.startsWith("v") ? tail.slice(1) : tail;
    return withoutVersion.join("/");
  } catch (error) {
    return value;
  }
};

export const upload = async (media, onProgress) => {
  if (!media) throw new Error("No file selected");

  const token = getToken();
  const formData = new FormData();
  formData.append("file", media);

  if (token) {
    formData.append("token", token);
  }

  const onUploadProgress = (progressEvent) => {
    if (!onProgress) return;
    if (!progressEvent.total) return;

    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    onProgress(percent.toFixed(2));
  };

  const res = await axios.post(`${getCloudinaryBaseUrl()}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return res.data;
};

export const deleteFile = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return null;

  const token = getToken();
  const publicId = extractPublicId(publicIdOrUrl) || publicIdOrUrl;

  if (!publicId) return null;

  const res = await axios.post(`${getCloudinaryBaseUrl()}/delete`, {
    publicId,
    token,
  });

  return res.data;
};

