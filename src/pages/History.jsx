import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import { Search } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("History");
  const [projectKey, setProjectKey] = useState(
    location.state?.projectKey || "SCRUM"
  );
  const [projectName, setProjectName] = useState(projectKey);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project name based on projectKey
  useEffect(() => {
    async function fetchProjectName() {
      try {
        if (projectKey !== "Unknown Project") {
          const response = await axios.get(
            `http://localhost:3000/api/jira/project/${projectKey}`
          );
          setProjectName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error.message);
        setProjectName(projectKey);
        setError("Failed to fetch project name from Jira.");
      }
    }
    fetchProjectName();
  }, [projectKey]);

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/jira/history/${projectKey}`
        );
        setHistory(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch history:", error.message);
        setError("Failed to fetch generation history.");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [projectKey]);

  useEffect(() => {
    const foundTab = projectSidebarItems.find(
      (item) => item.path === location.pathname
    );
    if (foundTab) {
      setActiveSubTab(foundTab.name);
    }
  }, [location.pathname]);

  return (
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
                  navigate(item.path, { state: { projectKey } });
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
                  navigate(item.path, { state: { projectKey } });
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
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link
                  to="/home"
                  className="font-medium text-[#343434] cursor-pointer"
                >
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  to="/dashboard"
                  state={{ projectKey }}
                  className="font-medium text-[#343434] cursor-pointer"
                >
                  {projectName}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-red-600 font-medium">History</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Requirements
              </h1>

              {/* Filter Layout */}
              <div className="flex items-center justify-between mb-6 w-full h-10">
                <div className="flex items-center gap-4 w-[621px] h-10">
                  {/* First Dropdown */}
                  <div className="relative">
                    <select className="appearance-none bg-white cursor-pointer outline-none pr-8 pl-3 py-2 w-[200px] h-10 rounded-[5px] border border-[#CBCBCB]">
                      <option>Healthcare Portal</option>
                      <option>E-commerce Platform</option>
                      <option>Banking System</option>
                      <option>Educational App</option>
                      <option>Social Media App</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Second Dropdown */}
                  <div className="relative">
                    <select className="appearance-none bg-white cursor-pointer outline-none pr-8 pl-3 py-2 w-[200px] h-10 rounded-[5px] border border-[#CBCBCB]">
                      <option>All Types</option>
                      <option>Unit Tests</option>
                      <option>Integration Tests</option>
                      <option>API Tests</option>
                      <option>UI Tests</option>
                      <option>Performance Tests</option>
                      <option>Security Tests</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-white outline-none px-3 py-2 w-[139px] h-10 rounded-[5px] border border-[#CBCBCB]"
                    />
                  </div>

                  {/* Search Icon */}
                  <div className="flex items-center">
                    <Search className="w-[18px] h-[18px] text-[#636363]" />
                  </div>
                </div>

                {/* New Test Button */}
                <button className="cursor-pointer flex items-center justify-center transition-opacity duration-200 w-[187px] h-10 rounded-md border border-[#EDEEF2] gap-2.5 bg-[#EB1700] shadow-[0px_0px_20px_rgba(0,0,0,0.08)]">
                  <span className="font-medium text-base leading-none text-white font-['Inter',sans-serif]">
                    Add New
                  </span>
                </button>
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  Loading history...
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-bold pb-3">
                            Jira ID
                          </th>
                          <th className="text-left text-xs font-bold pb-3">
                            User Story Title
                          </th>
                          <th className="text-left text-xs font-bold pb-3">
                            Status
                          </th>
                          <th className="text-left text-xs font-bold pb-3">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {history.length > 0 ? (
                          history.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="py-3 text-sm">
                                {item.jiraIssueId ? (
                                  <a
                                    href={`https://sweetdesignhub.atlassian.net/browse/${item.jiraIssueId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.jiraIssueId}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                              <td className="py-3 text-sm text-[#636363] max-w-xs truncate">
                                {item.title}
                              </td>
                              <td className="py-3 text-sm text-[#636363]">
                                {item.status}
                              </td>
                              <td className="py-3 text-sm text-[#636363]">
                                {new Date(item.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-3 text-sm text-[#636363] text-center"
                            >
                              No history found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
