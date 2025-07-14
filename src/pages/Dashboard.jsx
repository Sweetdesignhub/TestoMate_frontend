import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { RefreshCw, Edit3 } from "lucide-react";
import { RiHome2Line } from "react-icons/ri";
import {
  MdBackupTable,
  MdChecklist,
  MdInsights,
  MdOutline3P,
  MdOutlineDashboard,
  MdOutlineVerified,
} from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import totalTestsIcon from "../assets/total_tests.png";
import passedTestsIcon from "../assets/passed_tests.png";
import failedTestsIcon from "../assets/failed_tests.png";
import avgExecTimeIcon from "../assets/avg_time.png";
import { FaLaptopCode } from "react-icons/fa";
import { AiTwotoneExperiment } from "react-icons/ai";
import { LuCircleFadingArrowUp } from "react-icons/lu";
import { getProjectInfo, getProjectStories } from "../utils/jiraApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import Header from "../components/Header";

// Default chart data factory
const getDefaultChartData = () => [
  { name: "Passed", value: 0, color: "#10B981" },
  { name: "Failed", value: 0, color: "#EF4444" },
  { name: "Skipped", value: 0, color: "#F59E0B" },
  { name: "Blocked", value: 0, color: "#8B5CF6" },
];

// Default execution data factory
const getDefaultExecutionData = () => {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      }),
      passed: 0,
      failed: 0,
      skipped: 0,
      blocked: 0,
      total: 0,
    };
  }).reverse();
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [projectKey] = useState(
    location.state?.projectKey || "Unknown Project"
  );
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Dashboard");
  const [statsCards, setStatsCards] = useState([
    { title: "Total Tests", value: "0", icon: totalTestsIcon },
    { title: "Passed Tests", value: "0", icon: passedTestsIcon },
    { title: "Failed Tests", value: "0", icon: failedTestsIcon },
    { title: "Avg. Execution Time", value: "0s", icon: avgExecTimeIcon },
  ]);
  const [executionData, setExecutionData] = useState(getDefaultExecutionData());
  const [chartData, setChartData] = useState(getDefaultChartData());
  const [failedTests, setFailedTests] = useState([]);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState(projectKey);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Customize as needed

  useEffect(() => {
    async function fetchProjectName() {
      try {
        if (projectKey !== "Unknown Project") {
          const projectInfo = await getProjectInfo(projectKey);
          setProjectName(projectInfo.name);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error.message);
        setError("Failed to fetch project name from Jira.");
      }
    }
    fetchProjectName();
  }, [projectKey]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        if (!projectKey || projectKey === "Unknown Project") {
          throw new Error("No project key provided. Please select a project.");
        }
        const { total, stories } = await getProjectStories(projectKey);
        console.log("Project Key:", projectKey);

        const passed = stories.filter((s) => s.status === "Done").length;
        const failed = stories.filter((s) => s.status === "To Do").length;
        const skipped = stories.filter(
          (s) => s.status === "In Progress"
        ).length;
        const blocked = stories.filter((s) => s.status === "Blocked").length;
        const totalExecutionTime = stories.reduce(
          (sum, s) => sum + (s.executionTime || 0),
          0
        );
        const avgExecutionTime =
          stories.length > 0
            ? (totalExecutionTime / stories.length).toFixed(2)
            : 0;

        const today = new Date();
        const executionData = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          });
          let passedCount = i === 0 ? passed : 0;
          let failedCount = i === 0 ? failed : 0;
          let skippedCount = i === 0 ? skipped : 0;
          let blockedCount = i === 0 ? blocked : 0;

          stories.forEach((story) => {
            story.changelog?.forEach((change) => {
              const changeDate = new Date(change.created).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "2-digit" }
              );
              if (changeDate === dateStr) {
                change.items.forEach((item) => {
                  if (item.field === "status") {
                    if (item.toString === "Done") passedCount++;
                    if (item.toString === "To Do") failedCount++;
                    if (item.toString === "In Progress") skippedCount++;
                    if (item.toString === "Blocked") blockedCount++;
                  }
                });
              }
            });
          });

          return {
            date: dateStr,
            passed: passedCount,
            failed: failedCount,
            skipped: skippedCount,
            blocked: blockedCount,
            total: passedCount + failedCount + skippedCount + blockedCount,
          };
        }).reverse();

        const failedTestsData = stories
          .filter((s) => s.status === "To Do")
          .map((s) => ({
            name: s.summary,
            type: s.issueType,
            executor: s.assignee || "Unassigned",
            duration: s.executionTime
              ? `${(s.executionTime / 60).toFixed(2)}m`
              : "0m",
            date: new Date(s.updated).toLocaleString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        setStatsCards([
          {
            title: "Total Tests",
            value: total.toString(),
            icon: totalTestsIcon,
          },
          {
            title: "Passed Tests",
            value: passed.toString(),
            icon: passedTestsIcon,
          },
          {
            title: "Failed Tests",
            value: failed.toString(),
            icon: failedTestsIcon,
          },
          {
            title: "Avg. Execution Time",
            value: `${avgExecutionTime}s`,
            icon: avgExecTimeIcon,
          },
        ]);
        setExecutionData(executionData);
        setChartData([
          { name: "Passed", value: passed, color: "#10B981" },
          { name: "Failed", value: failed, color: "#EF4444" },
          { name: "Skipped", value: skipped, color: "#F59E0B" },
          { name: "Blocked", value: blocked, color: "#8B5CF6" },
        ]);
        setFailedTests(failedTestsData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch Jira data:", error.message);
        setError(
          error.message.includes("No project key")
            ? error.message
            : error.response?.status === 400
            ? "Invalid project key. Please select a valid project."
            : error.response?.status === 401
            ? "Unauthorized: Invalid Jira API token or email."
            : error.response?.status === 403
            ? "Forbidden: API token lacks permission to access stories."
            : "Failed to fetch project data from Jira."
        );
        setStatsCards([
          { title: "Total Tests", value: "0", icon: totalTestsIcon },
          { title: "Passed Tests", value: "0", icon: passedTestsIcon },
          { title: "Failed Tests", value: "0", icon: failedTestsIcon },
          { title: "Avg. Execution Time", value: "0s", icon: avgExecTimeIcon },
        ]);
        setExecutionData(getDefaultExecutionData());
        setChartData(getDefaultChartData());
        setFailedTests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [projectKey, navigate]);

  useEffect(() => {
    if (!location.state?.projectKey) {
      navigate("/home");
    }
  }, [location.state?.projectKey, navigate]);

  useEffect(() => {
    const foundTab = projectSidebarItems.find(
      (item) => item.path === location.pathname
    );
    if (foundTab) {
      setActiveSubTab(foundTab.name);
    }
  }, [location.pathname]);

  const totalPages = Math.ceil(failedTests.length / rowsPerPage);
  const paginatedTests = failedTests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

  return loading ? (
    <LoadingSpinner fullPage />
  ) : (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <div className="w-16 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-2 space-y-2">
            {mainSidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMainTab(item.name);
                  navigate(item.path);
                }}
                className={`w-full flex items-center justify-center cursor-pointer p-3 rounded-lg transition-colors ${
                  item.name === activeMainTab
                    ? "bg-red-50 text-red-600 border-2 border-red-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={item.name}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </nav>
        </div>

        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {projectSidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveSubTab(item.name);
                  if (item.path && location.pathname !== item.path) {
                    navigate(item.path, { state: { projectKey } });
                  }
                }}
                className={`w-full flex items-center cursor-pointer px-3 py-2 text-left rounded-lg transition-colors ${
                  item.name === activeSubTab
                    ? "bg-red-50 font-medium text-red-600 border-l-4 border-red-600"
                    : "font-medium hover:bg-gray-100 text-gray-600"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link
                  to="/home"
                  className="font-medium text-[#343434] cursor-pointer"
                >
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-red-600 font-medium">{projectName}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                    {statsCards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 relative shadow-sm border border-gray-200 h-[200px] flex flex-col justify-between"
                      >
                        <div className="flex justify-end">
                          <img
                            src={card.icon}
                            alt={`${card.title} icon`}
                            className="w-15 h-15 top-0 right-0 absolute"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3
                            className={`text-3xl font-medium mb-2 ${
                              card.title === "Passed Tests"
                                ? "text-[#1A9F2C]"
                                : card.title === "Failed Tests"
                                ? "text-[#EB1700]"
                                : "text-black"
                            }`}
                          >
                            {card.value}
                          </h3>
                          <p className="text-sm text-[#1C1B1FCC] font-medium">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[200px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Execution
                      </h3>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-gray-600">Passed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-gray-600">Failed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-gray-600">Skipped</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-gray-600">Blocked</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      {executionData.every((d) => d.total === 0) ? (
                        <div className="text-center text-gray-500 text-sm">
                          No execution data available
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={executionData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 10 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                fontSize: "12px",
                              }}
                            />
                            <Bar
                              dataKey="passed"
                              stackId="a"
                              fill="#10B981"
                              radius={[0, 0, 0, 0]}
                            />
                            <Bar
                              dataKey="failed"
                              stackId="a"
                              fill="#EF4444"
                              radius={[0, 0, 0, 0]}
                            />
                            <Bar
                              dataKey="skipped"
                              stackId="a"
                              fill="#F59E0B"
                              radius={[0, 0, 0, 0]}
                            />
                            <Bar
                              dataKey="blocked"
                              stackId="a"
                              fill="#8B5CF6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 xl:col-span-1 h-[450px]">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Execution
                  </h3>
                  <div className="relative">
                    <div className="relative h-64">
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-medium text-gray-900">
                          {statsCards[0].value}
                        </span>
                        <span className="text-[#00000099] font-medium">
                          Test
                        </span>
                      </div>
                      {chartData.every((d) => d.value === 0) ? (
                        <div className="text-center text-gray-500 text-sm">
                          No test data available
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={90}
                              paddingAngle={5}
                              stroke="none"
                            >
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div className="space-y-3">
                      {chartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="text-sm text-[#00000099]">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm text-[#00000099]">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Failed Executions
                    </h3>
                    <button className="text-sm font-semibold text-[#000098] cursor-pointer hover:text-blue-700">
                      View all tests
                    </button>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[405px] flex flex-col">
                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left text-xs font-bold pb-3 pr-4">
                              Test Name
                            </th>
                            <th className="text-left text-xs font-bold pb-3 px-4">
                              Type
                            </th>
                            <th className="text-left text-xs font-bold pb-3 px-4">
                              Executed by
                            </th>
                            <th className="text-left text-xs font-bold pb-3 px-4">
                              Duration
                            </th>
                            <th className="text-left text-xs font-bold pb-3 pl-4">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedTests.length > 0 ? (
                            paginatedTests.map((test, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 text-sm text-[#636363] pr-4">
                                  {test.name}
                                </td>
                                <td className="py-3 text-sm text-[#636363] px-4">
                                  {test.type}
                                </td>
                                <td className="py-3 text-sm text-[#636363] px-4">
                                  {test.executor}
                                </td>
                                <td className="py-3 text-sm text-[#636363] px-4">
                                  {test.duration}
                                </td>
                                <td className="py-3 text-sm text-[#636363] pl-4">
                                  {test.date}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <Edit3 className="w-4 h-4 text-[#000098]" />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <RefreshCw className="w-4 h-4 text-[#000098]" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                className="py-3 text-sm text-[#636363] text-center"
                              >
                                No failed tests found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center space-x-2 text-sm text-gray-700">
                        <button
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
                        >
                          Prev
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`px-3 py-1 cursor-pointer border rounded ${
                              currentPage === idx + 1
                                ? "bg-red-100 text-red-600"
                                : ""
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          className="px-3 py-1 border rounded cursor-pointer disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
