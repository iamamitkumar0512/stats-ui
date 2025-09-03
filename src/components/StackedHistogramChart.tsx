import React, { useState, useMemo } from "react";
import useGetStackedHistogram from "../hooks/useGetStackedHistogram";
import Dropdown from "./dropdown";
import ChartContainer from "./ChartContainer";
import {
  YEAR_OPTIONS,
  TABLE_TYPE_OPTIONS,
  COLUMN_TYPE_OPTIONS,
  DEFAULT_VALUES,
} from "../constants";

const StackedHistogramChart: React.FC = () => {
  const [startYear, setStartYear] = useState(DEFAULT_VALUES.START_YEAR);
  const [endYear, setEndYear] = useState(DEFAULT_VALUES.END_YEAR);
  const [tableType, setTableType] = useState<"by" | "against">(
    DEFAULT_VALUES.TABLE_TYPE
  );
  const [column, setColumn] = useState(DEFAULT_VALUES.COLUMN_TYPE);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Memoize hook parameters
  const stackedHistogramParams = useMemo(
    () => ({
      startYear: parseInt(startYear),
      endYear: parseInt(endYear),
      tableType: tableType,
      column: column,
    }),
    [startYear, endYear, tableType, column]
  );

  // Only fetch when shouldFetch is true
  const {
    data: stackedHistogramData,
    loading: stackedHistogramLoading,
    error: stackedHistogramError,
  } = useGetStackedHistogram(shouldFetch ? stackedHistogramParams : null);

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

  const handleColumnChange = (value: string) => {
    setColumn(value as "a_aff_resolved" | "c_aff_resolved");
    setShouldFetch(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
          Stacked Histogram ({yearRange})
        </h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <label className="block text-sm text-gray-700 mb-1">Column</label>
            <Dropdown
              options={COLUMN_TYPE_OPTIONS}
              defaultValue={column}
              onChange={handleColumnChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Fetch Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleFetchData}
            disabled={
              stackedHistogramLoading ||
              parseInt(startYear) >= parseInt(endYear)
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded border border-gray-300 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {stackedHistogramLoading ? "Loading..." : "Generate Histogram"}
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
          loading={stackedHistogramLoading}
          error={stackedHistogramError}
          data={stackedHistogramData}
        >
          {stackedHistogramData?.imageUrl && (
            <div className="mt-4">
              <img
                src={stackedHistogramData.imageUrl}
                alt="Stacked Histogram"
                className="w-full h-auto"
              />
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default StackedHistogramChart;
