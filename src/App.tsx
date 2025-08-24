import "./App.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import useGetCgdLinePlot from "./hooks/useGetCgdLinePlot";
import useGetCfdLinePlotByState from "./hooks/useGetCfdLinePlotByState";
import useGetIndiaMap from "./hooks/useGetIndiaMap";
import useGetWordCloud from "./hooks/useGetWordCloud";
import useGetStackedHistogram from "./hooks/useGetStackedHistogram";
import useGetCasesPerState from "./hooks/useGetCasesPerState";
import useDebounce from "./hooks/useDebounce";
import Dropdown from "./components/dropdown";
import Table from "./components/table";
import ChartContainer from "./components/ChartContainer";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  YEAR_OPTIONS,
  STATE_OPTIONS,
  TABLE_TYPE_OPTIONS,
  COLUMN_TYPE_OPTIONS,
  DEFAULT_VALUES,
} from "./constants";

function App() {
  const [startYear, setStartYear] = useState(DEFAULT_VALUES.START_YEAR);
  const [endYear, setEndYear] = useState(DEFAULT_VALUES.END_YEAR);
  const [selectedState, setSelectedState] = useState(
    DEFAULT_VALUES.SELECTED_STATE
  );
  const [tableType, setTableType] = useState<"by" | "against">(
    DEFAULT_VALUES.TABLE_TYPE
  );
  const [columnType, setColumnType] = useState<
    "a_aff_resolved" | "c_aff_resolved"
  >(DEFAULT_VALUES.COLUMN_TYPE);

  // Debounce parameters to prevent excessive API calls
  const debouncedStartYear = useDebounce(startYear, 300);
  const debouncedEndYear = useDebounce(endYear, 300);
  const debouncedSelectedState = useDebounce(selectedState, 300);
  const debouncedTableType = useDebounce(tableType, 300);
  const debouncedColumnType = useDebounce(columnType, 300);

  // Validate and fix year selection
  useEffect(() => {
    const start = parseInt(startYear);
    const end = parseInt(endYear);

    if (start >= end) {
      const newEndYear = Math.min(start + 1, 2023).toString();
      setEndYear(newEndYear);
    }
  }, [startYear, endYear]);

  // Memoize hook parameters to prevent unnecessary re-renders
  const cgdLinePlotParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
    }),
    [debouncedStartYear, debouncedEndYear, debouncedTableType]
  );

  const indiaMapParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
    }),
    [debouncedStartYear, debouncedEndYear, debouncedTableType]
  );

  const wordCloudParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
      columnType: debouncedColumnType,
    }),
    [
      debouncedStartYear,
      debouncedEndYear,
      debouncedTableType,
      debouncedColumnType,
    ]
  );

  const stackedHistogramParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
    }),
    [debouncedStartYear, debouncedEndYear, debouncedTableType]
  );

  const cfdLinePlotByStateParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
      stateName: debouncedSelectedState,
    }),
    [
      debouncedStartYear,
      debouncedEndYear,
      debouncedTableType,
      debouncedSelectedState,
    ]
  );

  const casesPerStateParams = useMemo(
    () => ({
      startYear: parseInt(debouncedStartYear),
      endYear: parseInt(debouncedEndYear),
      tableType: debouncedTableType,
    }),
    [debouncedStartYear, debouncedEndYear, debouncedTableType]
  );

  // Hooks
  const {
    data: cgdLinePlotData,
    loading: cgdLinePlotLoading,
    error: cgdLinePlotError,
  } = useGetCgdLinePlot(cgdLinePlotParams);
  const {
    data: indiaMapData,
    loading: indiaMapLoading,
    error: indiaMapError,
  } = useGetIndiaMap(indiaMapParams);
  const {
    data: wordCloudData,
    loading: wordCloudLoading,
    error: wordCloudError,
  } = useGetWordCloud(wordCloudParams);
  const {
    data: stackedHistogramData,
    loading: stackedHistogramLoading,
    error: stackedHistogramError,
  } = useGetStackedHistogram(stackedHistogramParams);
  const {
    data: cfdLinePlotByStateData,
    loading: cfdLinePlotByStateLoading,
    error: cfdLinePlotByStateError,
  } = useGetCfdLinePlotByState(cfdLinePlotByStateParams);
  const {
    data: casesPerStateData,
    loading: casesPerStateLoading,
    error: casesPerStateError,
  } = useGetCasesPerState(casesPerStateParams);

  // Memoize computed values
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

  // Memoize change handlers to prevent unnecessary re-renders
  const handleStartYearChange = useCallback((value: string) => {
    setStartYear(value);
  }, []);

  const handleEndYearChange = useCallback((value: string) => {
    setEndYear(value);
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setSelectedState(value);
  }, []);

  const handleTableTypeChange = useCallback((value: string) => {
    setTableType(value as "by" | "against");
  }, []);

  const handleColumnTypeChange = useCallback((value: string) => {
    setColumnType(value as "a_aff_resolved" | "c_aff_resolved");
  }, []);

  // Check if any data is loading
  const isAnyLoading = useMemo(
    () =>
      cgdLinePlotLoading ||
      indiaMapLoading ||
      wordCloudLoading ||
      stackedHistogramLoading ||
      cfdLinePlotByStateLoading ||
      casesPerStateLoading,
    [
      cgdLinePlotLoading,
      indiaMapLoading,
      wordCloudLoading,
      stackedHistogramLoading,
      cfdLinePlotByStateLoading,
      casesPerStateLoading,
    ]
  );

  // Check if parameters are being debounced (different from current values)
  const isDebouncing = useMemo(
    () =>
      startYear !== debouncedStartYear ||
      endYear !== debouncedEndYear ||
      selectedState !== debouncedSelectedState ||
      tableType !== debouncedTableType ||
      columnType !== debouncedColumnType,
    [
      startYear,
      debouncedStartYear,
      endYear,
      debouncedEndYear,
      selectedState,
      debouncedSelectedState,
      tableType,
      debouncedTableType,
      columnType,
      debouncedColumnType,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Data Visualization Dashboard
      </h1>

      {/* Controls */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Year
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <Dropdown
                options={STATE_OPTIONS}
                defaultValue={selectedState}
                onChange={handleStateChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

          {parseInt(startYear) >= parseInt(endYear) && (
            <p className="text-red-500 text-sm mt-2">
              End year must be greater than start year
            </p>
          )}

          {/* Status Indicators */}
          <div className="mt-4 space-y-2">
            {/* Global Loading Indicator */}
            {isAnyLoading && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" message="Updating charts..." />
                </div>
              </div>
            )}

            {/* Debouncing Indicator */}
            {isDebouncing && !isAnyLoading && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center text-yellow-700">
                  <div className="inline-block animate-pulse mr-2">⏳</div>
                  <span className="text-sm">Updating parameters...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* CGD Line Plot */}
        <ChartContainer
          title={`CDF Line Plot (${yearRange})`}
          loading={cgdLinePlotLoading}
          error={cgdLinePlotError}
          data={cgdLinePlotData}
        >
          {cgdLinePlotData?.imageUrl && (
            <div className="chart-container">
              <img
                src={cgdLinePlotData.imageUrl}
                alt="CDF Line Plot"
                className="chart-image"
              />
            </div>
          )}
        </ChartContainer>

        {/* India Map */}
        <ChartContainer
          title={`State-wise Heatmap (${yearRange})`}
          loading={indiaMapLoading}
          error={indiaMapError}
          data={indiaMapData}
        >
          {indiaMapData?.imageUrl && (
            <div className="chart-container">
              <img
                src={indiaMapData.imageUrl}
                alt="State-wise Heatmap"
                className="chart-image"
              />
            </div>
          )}
        </ChartContainer>

        {/* Word Cloud */}
        <ChartContainer
          title={`Word Cloud - ${columnTypeLabel} (${yearRange})`}
          loading={wordCloudLoading}
          error={wordCloudError}
          data={wordCloudData}
        >
          {wordCloudData?.imageUrl && (
            <div className="chart-container">
              <img
                src={wordCloudData.imageUrl}
                alt="Word Cloud"
                className="chart-image"
              />
            </div>
          )}
        </ChartContainer>

        {/* Stacked Histogram */}
        <ChartContainer
          title={`Stacked Histogram (${yearRange})`}
          loading={stackedHistogramLoading}
          error={stackedHistogramError}
          data={stackedHistogramData}
        >
          {stackedHistogramData?.imageUrl && (
            <div className="chart-container">
              <img
                src={stackedHistogramData.imageUrl}
                alt="Stacked Histogram"
                className="chart-image"
              />
            </div>
          )}
        </ChartContainer>

        {/* CDF Line Plot By State */}
        <ChartContainer
          title={`CDF Line Plot - ${selectedState} (${yearRange})`}
          loading={cfdLinePlotByStateLoading}
          error={cfdLinePlotByStateError}
          data={cfdLinePlotByStateData}
        >
          {cfdLinePlotByStateData?.imageUrl && (
            <div className="chart-container">
              <img
                src={cfdLinePlotByStateData.imageUrl}
                alt={`CDF Line Plot - ${selectedState}`}
                className="chart-image"
              />
            </div>
          )}
        </ChartContainer>

        {/* Cases Per State Table */}
        <ChartContainer
          title={`Cases Per State (${yearRange})`}
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
}

export default App;
