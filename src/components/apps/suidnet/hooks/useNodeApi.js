import { useAxiosInstance } from './useAxiosInstance';

/**
 * Custom hook for node-related API operations
 * Provides methods for registering, destroying nodes and managing clusters
 * @returns {Object} Object containing API methods
 */
export function useNodeApi() {
  const axios = useAxiosInstance();
  return {
    /**
     * Register a new node for the given wallet address
     * @param {string} address - User's wallet address
     * @returns {Promise<Object>} Response data from the registration
     * @throws {Error} If registration fails
     */
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

    /**
     * Destroy a specific node instance
     * @param {string} address - User's wallet address
     * @param {string} instanceId - ID of the node instance to destroy
     * @returns {Promise<Object>} Response data from the destruction
     * @throws {Error} If destruction fails
     */
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

    /**
     * Deploy a new Ray cluster
     * @param {string} address - User's wallet address
     * @param {Object} clusterConfig - Configuration for the cluster (currently unused)
     * @returns {Promise<Object>} Response data from the deployment
     * @throws {Error} If deployment fails
     */
    deployCluster: async (address, clusterConfig) => {
      console.log("address", address);
      try {
        const response = await axios.post('/cluster/deploy',
          {},
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

    /**
     * Execute Python code on a specific node
     * @param {string} address - User's wallet address
     * @param {string} code - Python code to execute
     * @param {string} headerIp - IP address of the head node
     * @returns {Promise<Object>} Response data containing execution results
     * @throws {Error} If execution fails
     */
    executePython: async (address, code, headerIp) => {
      try {
        const response = await axios.post('/task/execute-python',
          {
            code,
            headerIp
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
    },

    /**
     * Check if application is ready on a specific node
     * @param {string} address - User's wallet address
     * @param {string} ip - IP address of the node
     * @param {string} nodeType - Type of node ("header" | "worker")
     * @returns {Promise<Object>} Response data about application status
     * @throws {Error} If check fails
     */
    checkApplication: async (address, ip, nodeType) => {
      try {
        const response = await axios.post('/node/check-application',
          {
            ip,
            nodeType
          },
          {
            headers: {
              "user-address": address
            }
          }
        );

        return response.data;
      } catch (error) {
        console.error('Error checking application:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw error;
      }
    }
  };
} 