export const getStore = () => {
  const userToken = localStorage.getItem('token');
  const url = 'http://localhost:5005/store';
    
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    }
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return {}; 
      }
    })
    .catch((error) => {
      console.error("Error fetching store:", error);
      return {}; 
    });
};