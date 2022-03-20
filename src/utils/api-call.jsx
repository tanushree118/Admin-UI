const apiCall = async (url, data) => {
  let apiResult = [];
  try {
    apiResult = await fetch(url, data).then((response) => response.json());
  } catch (err) {
    return [];
  }
  return apiResult?.map((row) => ({ ...row, checked: false }));
};

export default apiCall;
