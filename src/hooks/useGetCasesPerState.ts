import { useState, useEffect } from "react";
import { API_BASE_URL } from "../constants";

interface CasesPerStateData {
  // Add properties based on what the API returns
  [key: string]: unknown;
}

const useGetCasesPerState = (
  params: {
    startYear: number;
    endYear: number;
    tableType: "against" | "by";
  } | null
) => {
  const [data, setData] = useState<CasesPerStateData | null>(null);
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

    const fetchCasesPerState = async () => {
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

        console.log(
          "Fetching cases per state with params:",
          queryParams.toString()
        );
        const response = await fetch(
          `${API_BASE_URL}/api/cases_per_state?${queryParams}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Response data:", responseData);
        console.log("Response data type:", typeof responseData);
        console.log("Response data isArray:", Array.isArray(responseData));

        // Handle different response formats
        let processedData = responseData;

        // If the response is an object with a data property, extract it
        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData)
        ) {
          if (responseData.data && Array.isArray(responseData.data)) {
            processedData = responseData.data;
          } else if (
            responseData.results &&
            Array.isArray(responseData.results)
          ) {
            processedData = responseData.results;
          } else if (responseData.cases && Array.isArray(responseData.cases)) {
            processedData = responseData.cases;
          }
        }

        console.log("Processed data:", processedData);
        console.log("Processed data isArray:", Array.isArray(processedData));

        setData(processedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error fetching cases per state:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCasesPerState();
  }, [params]);

  return {
    data,
    loading,
    error,
  };
};

export default useGetCasesPerState;
