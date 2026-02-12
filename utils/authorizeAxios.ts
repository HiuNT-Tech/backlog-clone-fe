import axios, { AxiosError } from 'axios';
import { toastHelpers } from '@/hooks/use-toast';
import { interceptorLoadingElements } from './formatters';
import { API_ROOT } from '@/utils/constants';

// Tránh gọi refresh-token nhiều lần song song
let refreshTokenPromise: Promise<unknown> | null = null;

// Khở tạo một đối tượng Axios mục đích là để custom và cấu hình chung cho dự án
const authorizedAxiosInstance = axios.create();
// Thời gian chờ tối đa của 1 request là 10p
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000;
// withCredentials: Sẽ cho phép axios tư động gửi cookie trogn mỗi request lên BE (phục vụ ciệc chúng ta sẽ lưu JWT tokens (refresh & access)vào trong httpOnly của Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true;

// Cấu hình Interceptors
// Interceptor request: Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  config => {
    // Kỹ thuật chặn user spam click
    interceptorLoadingElements(true);
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Interceptor response: Can thiệp vào giữa những cái response API
authorizedAxiosInstance.interceptors.response.use(
  response => {
    // Kỹ thuật chặn user spam click
    interceptorLoadingElements(false);
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Kỹ thuật chặn user spam click
    interceptorLoadingElements(false);
    //  Mọi những mã http status code ngoài khoang 200 - 299 sẽ là error và rơi vào đây
    const { response, config } = error;

    // Trường hợp cần refresh token (BE trả về 410)
    if (response?.status === 410 && config) {
      const originalRequest: any = config;

      // Tránh loop vô hạn: chỉ retry 1 lần / request
      if (originalRequest._retry) {
        // Nếu đã retry mà vẫn 410 thì coi như hết hạn hoàn toàn → về màn login
        if (typeof window !== 'undefined') {
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Nếu chưa có promise refresh đang chạy thì tạo mới
      if (!refreshTokenPromise) {
        refreshTokenPromise = axios
          .get(`${API_ROOT}/v1/users/refresh_token`, {
            withCredentials: true,
          })
          .catch((refreshError: AxiosError) => {
            // Refresh thất bại → buộc logout
            let refreshMessage = refreshError.message;
            if (
              refreshError.response?.data &&
              typeof refreshError.response.data === 'object' &&
              'message' in refreshError.response.data
            ) {
              refreshMessage = (
                refreshError.response.data as { message: string }
              ).message;
            }

            toastHelpers.error({ description: refreshMessage });

            if (typeof window !== 'undefined') {
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
              }
            }

            throw refreshError;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      // Sau khi refresh thành công thì gọi lại request cũ
      return refreshTokenPromise.then(() =>
        authorizedAxiosInstance(originalRequest)
      );
    }

    let errorMessage = error?.message;
    if (
      response?.data &&
      typeof response.data === 'object' &&
      'message' in response.data
    ) {
      errorMessage = (response.data as { message: string }).message;
    }
    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên trên màn hình - Ngoại trừ mã 410 - phục vụ việc tự động refresh lại token
    if (response?.status !== 410) {
      toastHelpers.error({ description: errorMessage });
    }

    // Handle authentication errors - redirect to login
    if (response?.status === 401 || response?.status === 403) {
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(errorMessage);
  }
);

export default authorizedAxiosInstance;
