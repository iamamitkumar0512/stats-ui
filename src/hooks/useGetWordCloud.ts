import { useState, useEffect } from "react";

interface WordCloudData {
  imageUrl: string;
}

const useGetWordCloud = (
  params: {
    startYear: number;
    endYear: number;
    tableType: "against" | "by";
    columnType: "a_aff_resolved" | "c_aff_resolved";
  } | null
) => {
  const [data, setData] = useState<WordCloudData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if parameters are null
    if (
      !params ||
      !params.startYear ||
      !params.endYear ||
      !params.tableType ||
      !params.columnType
    ) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const { startYear, endYear, tableType, columnType } = params;

    const fetchWordCloud = async () => {
      // Clear old data immediately when parameters change
      setData(null);
      setError(null);
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          table: tableType,
          column: columnType,
          start_year: startYear.toString(),
          end_year: endYear.toString(),
        });

        const response = await fetch(`/api/wordcloud?${queryParams}`, {
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
        console.error("Error fetching wordcloud data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWordCloud();

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

export default useGetWordCloud;
