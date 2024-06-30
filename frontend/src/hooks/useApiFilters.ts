import { useEffect, useState } from "react";
import axios from "../api/axios";
import { AxiosResponse, AxiosError } from "axios";

interface ApiFiltersResponse {
  data: {
    categories: string[];
    manufacturers: string[];
    priceRange: {
      maxPrice: number;
      minPrice: number;
    };
  };
  error?: {
    message: string;
  };
}

const useApiFilters = (url: string) => {
  const [data, setData] = useState<ApiFiltersResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiFiltersResponse["error"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse = await axios.get(url);
        setData(response.data);
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
  }, [url]);

  return { data, isLoading, error };
};

export default useApiFilters;
