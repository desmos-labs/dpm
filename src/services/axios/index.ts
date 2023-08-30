import axios from 'axios';

/**
 * Axios instance to interact with the DPM API.
 */
const dpmApiAxiosInstance = axios.create({
  baseURL: 'https://api-dpm.desmos.network',
  timeout: 1500,
});

export default dpmApiAxiosInstance;
