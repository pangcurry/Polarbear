import iconvLite from "iconv-lite";

export const getDownloadFilename = (req, fileName) => {
  const header = req.headers["user-agent"];

  if (header.includes("MSIE") || header.includes("Trident")) {
    return encodeURIComponent(fileName).replace(/\\+/gi, "%20");
  } else if (header.includes("Chrome")) {
    return iconvLite.decode(iconvLite.encode(fileName, "UTF-8"), "ISO-8859-1");
  } else if (header.includes("Opera")) {
    return iconvLite.decode(iconvLite.encode(fileName, "UTF-8"), "ISO-8859-1");
  } else if (header.includes("Firefox")) {
    return iconvLite.decode(iconvLite.encode(fileName, "UTF-8"), "ISO-8859-1");
  } else {
  }
};
