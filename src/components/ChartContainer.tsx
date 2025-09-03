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
      <div className={`w-full ${className}`}>
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          {title && (
            <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
              {title}
            </h2>
          )}
          <LoadingSpinner message="Loading chart..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          {title && (
            <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
              {title}
            </h2>
          )}
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          {title && (
            <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
              {title}
            </h2>
          )}
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">
              No data available for the selected criteria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        {title && (
          <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
