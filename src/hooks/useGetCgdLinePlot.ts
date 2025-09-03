import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../constants";

interface CdfLinePlotData {
  imageUrl: string;
  // Add other properties if the API returns additional data
}

const useGetCgdLinePlot = (
  params: {
    startYear: number;
    endYear: number;
    tableType: "against" | "by";
    column: string;
  } | null
) => {
  const [data, setData] = useState<CdfLinePlotData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Don't fetch if parameters are null
    if (
      !params ||
      !params.startYear ||
      !params.endYear ||
      !params.tableType ||
      !params.column
    ) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const { startYear, endYear, tableType, column } = params;

    const fetchCdfLinePlot = async () => {
      // Clear old data immediately when parameters change
      setData(null);
      setError(null);
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          table: tableType,
          start_year: startYear.toString(),
          end_year: endYear.toString(),
          column: column,
        });

        const response = await fetch(
          `${API_BASE_URL}/cdf_lineplot?${queryParams}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Since the API returns an image, we'll create a blob URL
        const blob = await response.blob();
        console.log("blob", blob);
        const imageUrl = URL.createObjectURL(blob);

        // Clean up previous image URL before setting new one
        if (imageUrlRef.current) {
          URL.revokeObjectURL(imageUrlRef.current);
        }
        imageUrlRef.current = imageUrl;
        setData({
          imageUrl,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching CDF lineplot:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCdfLinePlot();

    // Cleanup function to revoke blob URL when component unmounts or parameters change
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, [params]);

  return {
    data,
    loading,
    error,
  };
};

export default useGetCgdLinePlot;
