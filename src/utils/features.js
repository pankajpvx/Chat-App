import moment from "moment";

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (fileExt === "mp3" || fileExt === " wav") return "audio";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  return "file";
};

const transformImage = (url = "", width = 100) => {
  if (url) {
    const new_url = url.replace("/upload", `/upload/dpr_auto/w_${width}`);
    return new_url;
  }
  return null;
};

const getLast7days = () => {
  const currentDate = moment();
  const last7days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7days.unshift(dayName);
  }

  return last7days;
};

const getUniqueValues = (data = [], findBy) => {
  return data.reduce((acc, element, i) => {
    const isFound = acc.find(
      (ele) => element[findBy].toString() === ele[findBy].toString()
    );

    if (!isFound) {
      acc.push(element);
      return acc;
    }
    return acc;
  }, []);
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } else localStorage.setItem(key, JSON.stringify(value));
};

export {
  fileFormat,
  transformImage,
  getLast7days,
  getUniqueValues,
  getOrSaveFromStorage,
};
