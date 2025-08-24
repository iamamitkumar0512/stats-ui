import { useState, useEffect } from "react";

interface CdfLinePlotByStateData {
  imageUrl: string;
  // Add other properties if the API returns additional data
}

const useGetCfdLinePlotByState = (
  params: {
    startYear: number;
    endYear: number;
    tableType: "against" | "by";
    stateName: string;
  } | null
) => {
  const [data, setData] = useState<CdfLinePlotByStateData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if parameters are null
    if (
      !params ||
      !params.startYear ||
      !params.endYear ||
      !params.tableType ||
      !params.stateName
    ) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const { startYear, endYear, tableType, stateName } = params;

    const fetchCdfLinePlotByState = async () => {
      // Clear old data immediately when parameters change
      setData(null);
      setError(null);
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          table: tableType,
          state: stateName,
          start_year: startYear.toString(),
          end_year: endYear.toString(),
        });

        const response = await fetch(`/api/cdf_lineplot_state?${queryParams}`, {
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
        console.log("blob", blob);
        const imageUrl = URL.createObjectURL(blob);

        setData({
          imageUrl,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching CDF lineplot by state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCdfLinePlotByState();

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

export default useGetCfdLinePlotByState;
