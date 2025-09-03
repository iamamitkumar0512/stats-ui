import "./App.css";
import CgdLinePlotChart from "./components/CgdLinePlotChart";
import IndiaMapChart from "./components/IndiaMapChart";
import WordCloudChart from "./components/WordCloudChart";
import StackedHistogramChart from "./components/StackedHistogramChart";
// import CfdLinePlotByStateChart from "./components/CfdLinePlotByStateChart";
import CasesPerStateTable from "./components/CasesPerStateTable";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center">
            Data Visualization Dashboard
          </h1>
          <p className="text-gray-600 text-center mt-2 text-lg">
            Interactive charts and analytics for comprehensive data insights
          </p>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <CgdLinePlotChart />
            <IndiaMapChart />
            <WordCloudChart />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <StackedHistogramChart />
            <CasesPerStateTable />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
