import { useEffect, useState } from 'react';
import axios from 'axios';

function TestGoogleSheet() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = () => {
    const csvUrl =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRv1qoWJDjGlLKzfdpRtiZlxColDktOoYAww5jV8P1bnBCWg0o4mF3DNHLhpIQukftwS_WN7xA9SHez/pub?output=csv';
    axios
      .get(csvUrl)
      .then((response) => {
        const parsedCsvData = parseCSV(response.data);
        setCsvData(parsedCsvData);
        console.log(parsedCsvData);
      })
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
      });
  };

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(','); // Split the row, handling '\r' characters
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }

  return <>Hello</>;
}

export default TestGoogleSheet;
