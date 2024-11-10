import { useAxiosInstance } from './useAxiosInstance';

export function useNodeApi() {
  const axios = useAxiosInstance();
  return {
    registerNode: async (address) => {
      try {
        const response = await axios.post('/node/register', {}, {
          headers: {
            "user-address": address
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error registering node:', error);
        throw error;
      }
    },
    destroyNode: async (address, instanceId) => {
      try {
        const response = await axios.delete('/node/destroy', {
          headers: {
            "user-address": address
          },
          data: {
            instanceId: instanceId
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error destroying node:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.config?.headers
        });
        throw error;
      }
    },
    deployCluster: async (address, clusterConfig) => {
      try {
        const response = await axios.post('/cluster/deploy',
          clusterConfig,
          {
            headers: {
              "user-address": address
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error deploying cluster:', error);
        throw error;
      }
    },
    executePython: async (address, code) => {
      try {
        const response = await axios.post('/task/execute-python',
          {
            code: code
          },
          {
            headers: {
              "user-address": address
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error executing Python code:', error);
        throw error;
      }
    }
  };
} 