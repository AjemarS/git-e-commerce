import { useEffect, useState } from "react";
import axios from "../api/axios";
import { AxiosResponse, AxiosError } from "axios";

interface ApiFiltersResponse {
  data: {
    categories: string[];
    manufacturers: string[];
    price_range: {
      maxRange: number;
      minRange: number;
    };
  };
  error?: {
    message: string;
  };
}

const useApiProducts = (url: string, params?: {}) => {
  const [filters, setFilters] = useState<ApiFiltersResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiFiltersResponse["error"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse = await axios.get(url, { params: { params } });
        setFilters(response.data);
        console.log(response.data);
      } catch (err) {
        setError(
          (err as AxiosError<ApiFiltersResponse>).response?.data?.error || {
            message: "Something went wrong",
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, params]);

  return { filters, isLoading, error };
};

export default useApiProducts;
