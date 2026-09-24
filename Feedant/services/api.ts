import { Platform } from 'react-native';

// Use the dev tunnel URL to avoid Android's cleartext (HTTP) traffic blocking on physical devices
export const SERVER_URL = 'https://xdltm45v-5000.inc1.devtunnels.ms';
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
