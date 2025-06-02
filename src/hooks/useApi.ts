import api from "../services/api";

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    data: null,
    loading: true,
    error: null,
  };

  try {
    const res = await api.get<{ success: boolean; data: T }>(url);
    response.data = res.data.data;
  } catch (err: any) {
    response.error = err.handled
      ? "__HANDLED__"
      : err.response?.data?.message || err.message;
  } finally {
    response.loading = false;
  }

  return response;
}

export async function submitData<T>(
  url: string,
  data: any,
  method: "post" | "put" | "patch" = "post"
): Promise<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    data: null,
    loading: true,
    error: null,
  };

  try {
    const res = await api[method]<T>(url, data);
    response.data = res.data;
  } catch (err: any) {
    response.error = err.handled
      ? "__HANDLED__"
      : err.response?.data?.message || err.message;
  } finally {
    response.loading = false;
  }

  return response;
}

export async function deleteData<T>(url: string): Promise<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    data: null,
    loading: true,
    error: null,
  };

  try {
    const res = await api.delete<T>(url);
    response.data = res.data;
  } catch (err: any) {
    response.error = err.handled
      ? "__HANDLED__"
      : err.response?.data?.message || err.message;
  } finally {
    response.loading = false;
  }

  return response;
}

export async function deleteManyData<T>(
  url: string,
  ids: number[]
): Promise<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    data: null,
    loading: true,
    error: null,
  };

  try {
    const res = await api.delete<T>(url, { data: { ids } });
    response.data = res.data;
  } catch (err: any) {
    response.error = err.handled
      ? "__HANDLED__"
      : err.response?.data?.message || err.message;
  } finally {
    response.loading = false;
  }

  return response;
}
