// import { API_USER_URL } from '@env';

/**
 * Object Request Header
 */

let access = '';
if (typeof window !== 'undefined') {
  access = localStorage.getItem("deep-access") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1OThlMmI5LTkwZmYtNDc2NS1iYjA0LTgzMzgyZGVlNmUyNiIsImlhdCI6MTY5NTYxMzM2NSwiZXhwIjoxNjk1Njk5NzY1fQ.giwDNBW-eOYFUt1kL7Ba06sSvXoATBbqBmTsmBxFB1I';
}export const requestHeader = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'deep-token': access,
}
  
  /**
   *
   * @param {string} url
   * @param {string, [GET, POST, PATCH, PUT...]} method
   * @param {payload} payload
   * @param {boolean} token
   * @param {boolean} text
   * @param {boolean} form
   * @returns Response Data;
   *
   */

 
  
  let API_USER_URL = "http://192.81.213.226:81/81/";
  
  export async function request(url, method, payload, token, text, form) {
    requestHeader['Content-Type'] =
      form === true ? 'multipart/form-data' : 'application/json';
  
    if (method === 'GET') {
      return fetch(API_USER_URL + url, {
        method,
        headers: Object.assign(requestHeader)
      })
        .then(res => {
          if (text === true) {
            return res.text();
          } else if (res) {
            return res.json();
          } else {
            return res.json();
          }
        })
        .catch(err => {
          console.error(`Request Error ${url}: `, err);
          return err;
        });
    } else {
      return fetch(API_USER_URL + url, {
        method,
        headers: Object.assign(requestHeader),
        body: form === true ? payload : JSON.stringify(payload)
      })
        .then(res => {
          if (text === true) {
            return res.text();
          } else if (res) {
            return res.json();
          } else {
            return res.json();
          }
        })
        .catch(err => {
          console.error(`Request Error ${url}:`, err);
         return err
        });
    }
  }
  