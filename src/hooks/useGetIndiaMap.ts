import { useState, useEffect } from "react";

interface IndiaMapData {
  imageUrl: string;
}

const useGetIndiaMap = (
  params: {
    startYear: number;
    endYear: number;
    tableType: "against" | "by";
  } | null
) => {
  const [data, setData] = useState<IndiaMapData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if parameters are null
    if (!params || !params.startYear || !params.endYear || !params.tableType) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const { startYear, endYear, tableType } = params;

    const fetchIndiaMap = async () => {
      // Clear old data immediately when parameters change
      setData(null);
      setError(null);
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          table: tableType,
          start_year: startYear.toString(),
          end_year: endYear.toString(),
        });

        const response = await fetch(`/api/india_map?${queryParams}`, {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Since the API returns an image, we'll create a blob URL
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        setData({
          imageUrl,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching India map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndiaMap();

    // Cleanup function to revoke blob URL when component unmounts or parameters change
    return () => {
      if (data?.imageUrl) {
        URL.revokeObjectURL(data.imageUrl);
      }
    };
  }, [params]);

  return {
    data,
    loading,
    error,
  };
};

export default useGetIndiaMap;
