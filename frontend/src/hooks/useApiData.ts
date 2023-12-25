import { useEffect, useState } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";

interface ApiResponse {
  data: any;
  error?: {
    message: string;
  };
}

const useApiData = (url: string) => {
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiResponse["error"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<ApiResponse> = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(
          (err as AxiosError<ApiResponse>).response?.data?.error || {
            message: "Something went wrong",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApiData;
