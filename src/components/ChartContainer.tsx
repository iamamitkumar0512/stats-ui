import LoadingSpinner from "./LoadingSpinner";

interface ChartContainerProps {
  title: string;
  loading: boolean;
  error: string | null;
  data: any;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer = ({
  title,
  loading,
  error,
  data,
  children,
  className = "",
}: ChartContainerProps) => {
  if (loading) {
    return (
      <div className={`max-w-6xl mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {title}
          </h2>
          <LoadingSpinner message="Loading chart..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-6xl mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {title}
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`max-w-6xl mx-auto ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {title}
          </h2>
          <div className="text-center text-gray-500 py-8">
            <p>No data available for the selected criteria.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
