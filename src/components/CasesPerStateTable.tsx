import React, { useState, useMemo } from "react";
import useGetCasesPerState from "../hooks/useGetCasesPerState";
import Dropdown from "./dropdown";
import ChartContainer from "./ChartContainer";
import Table from "./table";
import { YEAR_OPTIONS, TABLE_TYPE_OPTIONS, DEFAULT_VALUES } from "../constants";

const CasesPerStateTable: React.FC = () => {
  const [startYear, setStartYear] = useState(DEFAULT_VALUES.START_YEAR);
  const [endYear, setEndYear] = useState(DEFAULT_VALUES.END_YEAR);
  const [tableType, setTableType] = useState<"by" | "against">(
    DEFAULT_VALUES.TABLE_TYPE
  );
  const [shouldFetch, setShouldFetch] = useState(false);

  // Memoize hook parameters
  const casesPerStateParams = useMemo(
    () => ({
      startYear: parseInt(startYear),
      endYear: parseInt(endYear),
      tableType: tableType,
    }),
    [startYear, endYear, tableType, shouldFetch]
  );

  // Only fetch when shouldFetch is true
  const {
    data: casesPerStateData,
    loading: casesPerStateLoading,
    error: casesPerStateError,
  } = useGetCasesPerState(shouldFetch ? casesPerStateParams : null);

  const yearRange = useMemo(
    () => `${startYear}-${endYear}`,
    [startYear, endYear]
  );

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  const handleStartYearChange = (value: string) => {
    setStartYear(value);
    setShouldFetch(false);
  };

  const handleEndYearChange = (value: string) => {
    setEndYear(value);
    setShouldFetch(false);
  };

  const handleTableTypeChange = (value: string) => {
    setTableType(value as "by" | "against");
    setShouldFetch(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
          Cases Per State ({yearRange})
        </h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Start Year
            </label>
            <Dropdown
              options={YEAR_OPTIONS}
              defaultValue={startYear}
              onChange={handleStartYearChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">End Year</label>
            <Dropdown
              options={YEAR_OPTIONS.filter(
                (option) => parseInt(option.value) > parseInt(startYear)
              )}
              defaultValue={endYear}
              onChange={handleEndYearChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Table Type
            </label>
            <Dropdown
              options={TABLE_TYPE_OPTIONS}
              defaultValue={tableType}
              onChange={handleTableTypeChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Fetch Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleFetchData}
            disabled={
              casesPerStateLoading || parseInt(startYear) >= parseInt(endYear)
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded border border-gray-300 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {casesPerStateLoading ? "Loading..." : "Generate Table"}
          </button>
        </div>

        {/* Validation Message */}
        {parseInt(startYear) >= parseInt(endYear) && (
          <p className="text-red-500 text-sm text-center mb-4">
            End year must be greater than start year
          </p>
        )}

        {/* Table Display */}
        <ChartContainer
          title=""
          loading={casesPerStateLoading}
          error={casesPerStateError}
          data={casesPerStateData}
        >
          {casesPerStateData && Array.isArray(casesPerStateData) && (
            <Table data={casesPerStateData} loading={false} error={null} />
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default CasesPerStateTable;
