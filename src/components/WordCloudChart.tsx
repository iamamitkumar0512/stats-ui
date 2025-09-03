import React, { useState, useMemo } from "react";
import useGetWordCloud from "../hooks/useGetWordCloud";
import Dropdown from "./dropdown";
import ChartContainer from "./ChartContainer";
import {
  YEAR_OPTIONS,
  TABLE_TYPE_OPTIONS,
  COLUMN_TYPE_OPTIONS,
  DEFAULT_VALUES,
} from "../constants";

const WordCloudChart: React.FC = () => {
  const [startYear, setStartYear] = useState(DEFAULT_VALUES.START_YEAR);
  const [endYear, setEndYear] = useState(DEFAULT_VALUES.END_YEAR);
  const [tableType, setTableType] = useState<"by" | "against">(
    DEFAULT_VALUES.TABLE_TYPE
  );
  const [columnType, setColumnType] = useState<
    "a_aff_resolved" | "c_aff_resolved"
  >(DEFAULT_VALUES.COLUMN_TYPE);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Memoize hook parameters
  const wordCloudParams = useMemo(
    () => ({
      startYear: parseInt(startYear),
      endYear: parseInt(endYear),
      tableType: tableType,
      columnType: columnType,
    }),
    [startYear, endYear, tableType, columnType, shouldFetch]
  );

  // Only fetch when shouldFetch is true
  const {
    data: wordCloudData,
    loading: wordCloudLoading,
    error: wordCloudError,
  } = useGetWordCloud(shouldFetch ? wordCloudParams : null);

  const yearRange = useMemo(
    () => `${startYear}-${endYear}`,
    [startYear, endYear]
  );

  const columnTypeLabel = useMemo(
    () =>
      columnType === "a_aff_resolved"
        ? "Affected Resolved (A)"
        : "Affected Resolved (C)",
    [columnType]
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

  const handleColumnTypeChange = (value: string) => {
    setColumnType(value as "a_aff_resolved" | "c_aff_resolved");
    setShouldFetch(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
          Word Cloud - {columnTypeLabel} ({yearRange})
        </h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Column Type
            </label>
            <Dropdown
              options={COLUMN_TYPE_OPTIONS}
              defaultValue={columnType}
              onChange={handleColumnTypeChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Fetch Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleFetchData}
            disabled={
              wordCloudLoading || parseInt(startYear) >= parseInt(endYear)
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded border border-gray-300 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {wordCloudLoading ? "Loading..." : "Generate Word Cloud"}
          </button>
        </div>

        {/* Validation Message */}
        {parseInt(startYear) >= parseInt(endYear) && (
          <p className="text-red-500 text-sm text-center mb-4">
            End year must be greater than start year
          </p>
        )}

        {/* Chart Display */}
        <ChartContainer
          title=""
          loading={wordCloudLoading}
          error={wordCloudError}
          data={wordCloudData}
        >
          {wordCloudData?.imageUrl && (
            <div className="mt-4">
              <img
                src={wordCloudData.imageUrl}
                alt="Word Cloud"
                className="w-full h-auto"
              />
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default WordCloudChart;
