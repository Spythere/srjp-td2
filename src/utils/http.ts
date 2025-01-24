import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://stacjownik.spythere.eu',
  timeout: 3000,
});

export default httpClient;
