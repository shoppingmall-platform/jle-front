import axios from "axios";
import { useAuthStore } from "@/store/auth/authStore";

export function useApi() {
  const authStore = useAuthStore();

  const request = async (method, url, data, header, config) => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Access-Token": authStore.userInfo.accessToken
          ? authStore.userInfo.accessToken
          : "",
        "Refresh-Token": authStore.userInfo.refreshToken
          ? authStore.userInfo.refreshToken
          : "",
        // 'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Credentials": false,
      },
      timeout: 1800000,
    });

    // 요청 인터셉터
    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    try {
      let response = [];
      if (method === "GET") {
        response = await instance.get(url, data, config); // .request<T>({ method, url, data });
      } else if (method === "POST") {
        response = await instance.post(url, data, config); // .request<T>({ method, url, data });
      }

      // 갱신된 토큰정보 저장
      if (authStore.isLogin()) {
        authStore.setToken(
          response.headers["access-token"],
          response.headers["refresh-token"]
        );
      }

      return {
        status: response?.status,
        data: response?.data,
        header: response?.headers,
      };
    } catch (err) {
      //예외처리
      console.error(err);

      // 로그인 여부 체크
      if (!authStore.isLogin()) {
        // 로그인 x
        authStore.login();
        return;
      } else if (
        err.response?.status === 401 &&
        err.response.data?.errCode === "AUTH005"
      ) {
        // 만료된 토큰 (EXPIRED_TOKEN)
        setTimeout(() => {
          authStore.login();
        }, 500);
        return;
      }

      // 기타 오류 대응
      if (err.response?.status !== 200) {
        const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        let errMsg = korean.test(err.response?.data?.errMsg)
          ? err.response?.data?.errMsg
          : "시스템 오류입니다.";

        if (err.response?.status === 403) {
          errMsg = "권한이 없습니다.";
        } else if (err.response?.status === 500) {
          errMsg = err?.message;
        } else {
          errMsg = err?.message;
        }
      }

      return {
        status: err.response?.status,
        errorInfo: err.response?.data || {},
      };
    }
  };

  //   const get = (url, params, config) => {
  //     return request("GET", url, { params, ...config });
  //   };
  //   const post = (url, params, config) => {
  //     return request("POST", url, params);
  //   };

  //   return { get, post };
  return {
    get: (url, params, config) => request("GET", url, params, null, config),
    post: (url, params, config) => request("POST", url, params, null, config),
  };
}
