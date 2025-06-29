// import { API_URL } from "./constants";
// import { manageLocalStorage } from "./localstorage";


// // lib/api/client.js
// export async function fetchAPI(endpoint:string) {
//     const token = manageLocalStorage.get('token');
  
//   const url = `${API_URL}${endpoint}`;
  
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     }
//   };
  
//   try {
//     const response = await fetch(url, defaultOptions);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`API request err: ${url}`, error);
//     return null;
//   }
// }