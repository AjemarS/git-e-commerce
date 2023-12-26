import { useEffect, useState } from "react";
import axios from "../api/axios";
import { AxiosResponse, AxiosError } from "axios";
import { IProduct } from "../models/product";

interface ApiProductsResponse {
  data: {
    count: number;
    next: string;
    previous: string;
    results: IProduct[];
  };
  error?: {
    message: string;
  };
}

const useApiProducts = (url: string, params?: {}) => {
  const [products, setProducts] = useState<ApiProductsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiProductsResponse["error"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse = await axios.get(url, params);
        setProducts(response.data);
      } catch (err) {
        setError(
          (err as AxiosError<ApiProductsResponse>).response?.data?.error || {
            message: "Something went wrong",
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, params]);

  return { products, isLoading, error };
};

export default useApiProducts;