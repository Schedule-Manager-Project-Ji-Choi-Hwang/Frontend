import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "./config/config";

axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await AsyncStorage.getItem('AccessToken')
            const refreshToken = await AsyncStorage.getItem('RefreshToken');
            try{
                const newToken = await refreshAccessToken(accessToken , refreshToken);
                await AsyncStorage.setItem('AccessToken', newToken);
                originalRequest.headers['Authorization'] = newToken;
                return axios(originalRequest);
            }catch (error) {
                console.error('오류 Error sending request:', error);
                console.error('리프레시 토큰까지 만료됨.');
            }
        }
        return Promise.reject(error);
    }
);

async function refreshAccessToken(accessToken, refreshToken) {
    const response = await axios.post(`${Config.MY_IP}:8080/member/refresh`, {}, {
        headers: { 'Authorization': accessToken, 'Refresh-Token': refreshToken}
    });

    if (response.status == 204) {
        console.log("리프레시 기능 성공!")
        return response.headers['authorization']
    } else {
        console.log("리프레시 실패")
    }
}

export default axios;