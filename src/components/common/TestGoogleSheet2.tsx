import axios from 'axios';
import React, { useEffect } from 'react';

function TestGoogleSheet2() {
  useEffect(() => {
    axios
      .get(
        'https://content-sheets.googleapis.com/v4/spreadsheets/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/values/Team Dang?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=AIzaSyDFxHGu-X0MhVT8LM3i-pMvVXCCotz2o6k',
      )
      .then((res) => console.log('res', res));
    axios
      .get(
        'https://content-sheets.googleapis.com/v4/spreadsheets/1kzveL2qPN3MekbIZbz49j00snPwlj4U-uknKiFMWmNA/values/FlashshipVariant?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=AIzaSyDFxHGu-X0MhVT8LM3i-pMvVXCCotz2o6k',
      )
      .then((res) => console.log('res', res));
  }, []);

  return <>Hello</>;
}

export default TestGoogleSheet2;
