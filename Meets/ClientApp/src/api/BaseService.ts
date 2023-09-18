import Cookies from 'js-cookie'
import { isJson, getTokenExpireTime } from "../common/Utils";
import ApiError from "../common/ApiError";
import accountService from './AccountService';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:53237/' // IIS Express
});

http.interceptors.request.use(
    async function (config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        let token = Cookies.get('access_token');
        let isExpire = !token;

        if (isExpire) {
            // обновление токена из accountService
            const jwtResponse = await accountService.refreshToken();
            Cookies.set('access_token', jwtResponse.accessToken, { expires: getTokenExpireTime() });

            config.headers = { ...config.headers, Authorization: `Bearer  ${jwtResponse.accessToken}` };
        } else {
            config.headers = { ...config.headers, Authorization: `Bearer  ${token}` };
        }

        if (isJson(config.data)) {
            config.headers = { ...config.headers, "Content-Type": "application/json;charset=UTF-8" };
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    function (res) {
        return res;
    },
    function (error) {
        // запрос был сделан и сервер ответил кодом состояния
        // за пределами 2XX
        if (error.response) {
            if (error.response.status === 400) {
                let message = error.response.data.errors?.map((err: any) => err.description).join('<br/>');
                return Promise.reject(new ApiError(message, error.response.status));
            }
            else if (error.response.status === 401) {
                let message = Object.values(error.response.data.errors).join('<br/>');
                return Promise.reject(new ApiError(message, error.response.status));
            }
            else if (error.response.status === 500) {
                let message = error.response.data.errors?.map((err: any) => err.description).join('<br/>');
                return Promise.reject(new ApiError(message, error.response.status));
            }
            else if (error.response.status === 415) {
                let message = `Неподдерживаемый формат данных запроса (HTTP ${error.response.status})`;
                return Promise.reject(new ApiError(message, error.response.status));
            }
            else {
                let message = `Неизвестная ошибка API (HTTP ${error.response.status})`;
                return Promise.reject(new ApiError(message));
            }
        }
        // запрос был сделан но ответ не получен
        else if (error.request) {
            return Promise.reject(new ApiError(error.request));
        }
        // произошло что-то при настройке запроса вызвавшее ошибку
        else {
            return Promise.reject(new ApiError(error.message));
        }
    }
);

const httpService = {
    post: http.post
};

export default httpService;
