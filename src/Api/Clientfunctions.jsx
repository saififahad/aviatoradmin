import axios from "axios";
import { toast } from "react-toastify";
export const baseURL = process.env.REACT_APP_API_URL;
export const token = localStorage.getItem("admin");

if (!baseURL) {
  console.log(
    ">BaseURL error,please check your env file or visit api/ClientFunction.jsx file to see more details...,Thanks!..."
  );
}
if (!token) {
  console.log(">token not available,Thanks!...");
}
const api = axios.create({
  baseURL: baseURL, // Add the protocol (http or https) before the hostname
});
export function getMappedValue(input) {
  switch (input) {
    case "l":
      return "Big";
    case "n":
      return "Small";
    case "t":
      return "Violet";
    case "d":
      return "Red";
    case "x":
      return "Green";
    default:
      return input;
  }
}
const handleRequest = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem("admin");
    const response = await api({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message
        ? error?.response?.data?.message
        : "Something went wrong!..."
    );
    return { success: false, err: error.message };
  }
};
export const fetchData = (url) => handleRequest("get", url);

export const postData = (url, data) => handleRequest("post", url, data);

export const updateData = (url, data) => handleRequest("put", url, data);

export const deleteData = (url, data) => handleRequest("delete", url, data);

export const requestData = (method, url, data) => {
  return handleRequest(method, url, data);
};
// normal function
export function formatDateString(isoDateString) {
  if (!isoDateString) {
    return "Not available";
  }

  const dateObject = new Date(isoDateString);

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formattedDate = dateObject.toLocaleString("en-US", options);
  return formattedDate;
}

export function formatTimestamp(timestamp) {
  if (timestamp) {
    return "Not available";
  }
  const date = new Date(parseInt(timestamp));

  const options = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

export function formatStatusCode(statusCode) {
  switch (Number(statusCode)) {
    case 0:
      return "pending";
    case 1:
      return "approved";
    case 2:
      return "rejected";
    default:
      return "unknown"; // or handle the case when the status code is not 0, 1, or 2
  }
}
export function formatTime(dateString) {
  const options = { hour: "numeric", minute: "numeric", hour12: true };

  const formattedTime = new Date(dateString).toLocaleTimeString([], options);

  return formattedTime;
}

export const formatSeconds = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return [
    Math.floor(minutes / 10),
    minutes % 10,
    Math.floor(seconds / 10),
    seconds % 10,
  ];
};