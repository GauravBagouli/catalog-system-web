import axios from './instance';
import apiKeys, { type ApiKey } from './apiKeys';
import type { AxiosRequestConfig } from 'axios';

const controller = new AbortController(); // Create an AbortController instance

const getUrlByKey = (key: ApiKey) => {
  return apiKeys[key];
};

class API {
    // eslint-disable-next-line lines-around-comment
    /**
     * auth2 login api
     * @param {string} url String
     * @param {object} payload Object
     * @param {object} action Object e.g {type: 'AUTH', dispatch: function(){} }
     * @returns {Promise<void>} void
     */

    static apiGet = async (key: ApiKey, args?: any) => {
        if (typeof args === 'string') {
            return axios.get(getUrlByKey(key) + args, {
                withCredentials: false,
                signal: controller.signal,
            });
        }
        return axios.get(getUrlByKey(key), {
            params: args,
            withCredentials: false,
            signal: controller.signal,
        });
    };

    static apiPost = async (key: ApiKey, args: any, headers: AxiosRequestConfig<any> | undefined) => {
        return axios.post(getUrlByKey(key), args, {
            ...headers,
            signal: controller.signal,
        });
    };
}

export default API;

// # interceptors
axios.interceptors.request.use(
    configs => {
        configs.signal = controller.signal;
        return configs;
    },
    error => {
        return Promise.reject(error);
    }
);
