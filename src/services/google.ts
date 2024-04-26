import axios from 'axios';
import { constants as c } from '../constants';

const getAllSheetInfo = (range: string) => {
  // return axios.get('https://content-sheets.googleapis.com/v4/spreadsheets/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/values/Team Dang?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=AIzaSyD4wBhrUIOw3GAhPXo2sL767W2U3tvmbxY')
  const params = new URLSearchParams({
    key: c.API_GOOGLE_KEY,
    majorDimension: 'ROWS',
    valueRenderOption: 'FORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  }).toString();
  return axios({
    method: 'get',
    url: `${c.API_GOOGLE_SHEETS}/${c.SHEET_ID}/values/${range}${params ? `?${params}` : ''}`,
  });
};

// const AddRowToSheet = (range, data, oauthAccessToken) => {
//     const params = new URLSearchParams({
//         key: c.API_GOOGLE_KEY,
//         // majorDimension: 'ROWS',
//         // valueRenderOption: 'FORMATTED_VALUE',
//         // dateTimeRenderOption: 'FORMATTED_STRING',
//         // includeValuesInResponse: true,
//         // responseDateTimeRenderOption: 'FORMATTED_STRING',
//         // responseValueRenderOption: 'FORMATTED_VALUE',
//         valueInputOption: 'RAW'
//     }).toString()
//     return axios({
//         method: "post",
//         url: `${c.API_GOOGLE_SHEETS}/${c.SHEET_ID}/values/${range}:append${params ? `?${params}` : ''}`,
//         data: data,
//         headers: {
//             'Content-Type': 'application/json',
//             // 'authorization': `Bearer ${oauthAccessToken}`
//             'Authorization': `Bearer ${oauthAccessToken}`
//         },
//     })
// }

const AddRowToSheet = (range: string, data: Record<string, unknown>, oauthAccessToken: string) => {
  const params = new URLSearchParams({
    key: c.API_GOOGLE_KEY,
    valueInputOption: 'RAW',
  }).toString();

  const url = `${c.API_GOOGLE_SHEETS}/${c.SHEET_ID}/values/${range}:append${params ? `?${params}` : ''}`;

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${oauthAccessToken}`,
    },
  }).then((response) => response.json());
};

export const google = {
  getAllSheetInfo,
  AddRowToSheet,
};
