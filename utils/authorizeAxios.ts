import axios, { AxiosError } from 'axios';
import { toastHelpers } from '@/hooks/use-toast';
import { interceptorLoadingElements } from './formatters';

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
    let errorMessage = error?.message;
    if (
      error.response?.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data
    ) {
      errorMessage = (error.response.data as { message: string }).message;
    }
    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên trên màn hình - Ngoại trừ mã 410 - phục vụ việc tự động refresh lại token
    if (error.response?.status !== 410) {
      toastHelpers.error({ description: errorMessage });
    }

    // Handle authentication errors - redirect to login
    if (error.response?.status === 401 || error.response?.status === 403) {
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
