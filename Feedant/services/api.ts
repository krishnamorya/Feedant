import { Platform } from 'react-native';

// For local development:
// Android emulator uses 10.0.2.2 to point to host machine's localhost
// iOS simulator uses localhost
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = 5000;

export const SERVER_URL = `http://${HOST}:${PORT}`;
export const API_BASE_URL = `${SERVER_URL}/api/v1`;

export const fetchHealthCheck = async () => {
  try {
    const response = await fetch(`https://xdltm45v-5000.inc1.devtunnels.ms/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching health check:', error);
    throw error;
  }
};

export const fetchCompetitions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
};
