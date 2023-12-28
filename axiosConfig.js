import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "./config/config";
import authEvents from './events';

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await AsyncStorage.getItem('AccessToken');
            const refreshToken = await AsyncStorage.getItem('RefreshToken');

            try {
                const newToken = await refreshAccessToken({ accessToken, refreshToken });
                await AsyncStorage.setItem('AccessToken', newToken);
                originalRequest.headers['Authorization'] = newToken;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('리프레시 토큰 만료:', refreshError);
                await AsyncStorage.removeItem('AccessToken');
                await AsyncStorage.removeItem('RefreshToken');
                authEvents.emit('tokenExpired');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);



const refreshAccessToken = async ({ accessToken, refreshToken }) => {
    try {
        const response = await axios.post(`${Config.MY_IP}:8080/member/refresh`, {}, {
            headers: { 'Authorization': accessToken, 'Refresh-Token': refreshToken }
        });

        if (response.status === 204) {
            return response.headers['authorization'];
        } else {
            throw new Error("리프레시 실패");
        }
    } catch (error) {
        throw error;
    }
};

export default axios;
