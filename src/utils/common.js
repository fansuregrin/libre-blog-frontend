const formatDate = (dateStr) => {
  // ISO 8601 格式: YYYY-MM-DDTHH:mm:ss.sssZ
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const formatDateTime = (dateStr) => {
  // ISO 8601 格式: YYYY-MM-DDTHH:mm:ss.sssZ
  const date = new Date(dateStr);
  return date.toLocaleString();
};

export {
  formatDate,
  formatDateTime
};