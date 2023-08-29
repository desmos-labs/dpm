import axios from 'axios';

/**
 * Axios instance to interact with the DPM API.
 */
const dpmApiAxiosInstance = axios.create({
  // TODO: Use a proper domain name instead of the ip.
  baseURL: 'http://57.128.144.235:33000/deep-links',
  timeout: 1500,
});

export default dpmApiAxiosInstance;
