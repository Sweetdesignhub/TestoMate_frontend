import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search,
  Edit3,
  Download,
  RefreshCw,
} from "lucide-react";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import Header from "../components/Header";

const Testing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectKey] = useState(
    location.state?.projectKey || "Unknown Project"
  );
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Testing");
  const [projectName, setProjectName] = useState(projectKey);
  const [showNewTestContainer, setShowNewTestContainer] = useState(false);

  // Test data for table
  const testData = [
    {
      id: 1,
      testName: "User Authentication Test",
      type: "Unit Test",
      status: "completed",
      executedBy: "John Doe",
      duration: "16m 36s",
      date: "10.04.2020, 12:45",
      hasDownload: true,
      hasRefresh: false
    },
    {
      id: 2,
      testName: "Database Connection Test",
      type: "Integration Test",
      status: "failed",
      executedBy: "Jane Smith",
      duration: "8m 22s",
      date: "09.04.2020, 14:30",
      hasDownload: false,
      hasRefresh: true
    },
    {
      id: 3,
      testName: "API Response Test",
      type: "API Test",
      status: "in-progress",
      executedBy: "Mike Johnson",
      duration: "5m 12s",
      date: "08.04.2020, 09:15",
      hasDownload: true,
      hasRefresh: false
    },
    {
      id: 4,
      testName: "UI Component Test",
      type: "UI Test",
      status: "disabled",
      executedBy: "Sarah Wilson",
      duration: "12m 48s",
      date: "07.04.2020, 16:20",
      hasDownload: false,
      hasRefresh: true
    },
    {
      id: 5,
      testName: "Performance Load Test",
      type: "Performance Test",
      status: "in-progress",
      executedBy: "Alex Brown",
      duration: "25m 14s",
      date: "06.04.2020, 11:10",
      hasDownload: true,
      hasRefresh: false
    },
    {
      id: 6,
      testName: "Security Vulnerability Test",
      type: "Security Test",
      status: "completed",
      executedBy: "Emma Davis",
      duration: "18m 05s",
      date: "05.04.2020, 13:25",
      hasDownload: false,
      hasRefresh: true
    },
    {
      id: 7,
      testName: "Email Notification Test",
      type: "Integration Test",
      status: "completed",
      executedBy: "David Miller",
      duration: "9m 42s",
      date: "04.04.2020, 10:15",
      hasDownload: true,
      hasRefresh: false
    },
    {
      id: 8,
      testName: "Payment Gateway Test",
      type: "API Test",
      status: "failed",
      executedBy: "Lisa Garcia",
      duration: "22m 18s",
      date: "03.04.2020, 15:30",
      hasDownload: false,
      hasRefresh: true
    },
    {
      id: 9,
      testName: "Mobile Responsive Test",
      type: "UI Test",
      status: "completed",
      executedBy: "Robert Chen",
      duration: "14m 55s",
      date: "02.04.2020, 08:45",
      hasDownload: true,
      hasRefresh: false
    },
    {
      id: 10,
      testName: "Session Management Test",
      type: "Unit Test",
      status: "disabled",
      executedBy: "Maria Rodriguez",
      duration: "7m 33s",
      date: "01.04.2020, 17:20",
      hasDownload: false,
      hasRefresh: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'disabled':
        return 'text-gray-500';
      case 'in-progress':
        return 'text-cyan-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in-progress':
        return 'In progress';
      default:
        return status;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
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
          <main className="flex-1 overflow-y-auto p-6">
            <div className="">
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

              <h1 className="text-3xl text-gray-900 mb-8 font-['Johnson', 'sans-serif']">
                All Tests
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
                <button
                  className="cursor-pointer flex items-center justify-center transition-opacity duration-200 w-[187px] h-10 rounded-md border border-[#EDEEF2] gap-2.5 bg-[#EB1700] shadow-[0px_0px_20px_rgba(0,0,0,0.08)]"
                  onClick={() => setShowNewTestContainer(!showNewTestContainer)}
                  style={{ opacity: showNewTestContainer ? 0.6 : 1 }}
                >
                  <span className="font-medium text-base leading-none text-white font-['Inter',sans-serif]">
                    New Test +
                  </span>
                </button>
              </div>

              {/* New Test Container */}
              {showNewTestContainer && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-8 px-12 mb-6 w-full">
                  {/* Dropdown Options */}
                  <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
                    {/* Test Type */}
                    <div className="relative">
                      <select className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]">
                        <option value="">Select</option>
                        <option value="unit">Unit Test</option>
                        <option value="integration">Integration Test</option>
                        <option value="api">API Test</option>
                        <option value="ui">UI Test</option>
                        <option value="performance">Performance Test</option>
                        <option value="security">Security Test</option>
                      </select>
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                        Test type
                      </label>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Environment */}
                    <div className="relative">
                      <select className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]">
                        <option value="">Select</option>
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                        Environment
                      </label>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Linked Module */}
                    <div className="relative">
                      <select className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]">
                        <option value="">Select</option>
                        <option value="auth">Authentication Module</option>
                        <option value="payment">Payment Module</option>
                        <option value="user">User Management</option>
                        <option value="reporting">Reporting Module</option>
                      </select>
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                        Linked Module
                      </label>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Select Tests */}
                    <div className="relative">
                      <select className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]">
                        <option value="">Select</option>
                        <option value="all">All Tests</option>
                        <option value="smoke">Smoke Tests</option>
                        <option value="regression">Regression Tests</option>
                        <option value="custom">Custom Selection</option>
                      </select>
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                        Select Tests
                      </label>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Schedule and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Schedule */}
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]"
                        />
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                          Schedule
                        </label>
                      </div>

                      {/* Time */}
                      <div className="relative">
                        <input
                          type="time"
                          defaultValue="00:00"
                          className="w-full h-11 px-4 py-3 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-500 font-normal text-[14px] leading-none tracking-normal border-[#D2D5DA] shadow-[0px_2px_2px_rgba(0,0,0,0.05)] text-[#0d0c0d] font-['Inter',sans-serif]"
                        />
                        <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 font-bold font-['Inter',sans-serif]">
                          Time
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Schedule Button */}
                      <button
                        onClick={() => setShowNewTestContainer(false)}
                        className="h-10 bg-transparent border-none font-bold text-base text-gray-800 cursor-pointer hover:text-gray-600 transition-colors font-['Inter',sans-serif]"
                      >
                        Schedule
                      </button>

                      {/* Execute Button */}
                      <button
                        onClick={() => setShowNewTestContainer(false)}
                        className="h-10 rounded-md border border-gray-200 bg-red-600 text-white font-medium text-base cursor-pointer hover:bg-red-700 transition-colors shadow-lg font-['Inter',sans-serif]"
                      >
                        Execute
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Table Container */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto max-h-110 overflow-y-auto">
                  <table className="w-full font-['Inter',sans-serif]">
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Test Name</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Type</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Status</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Executed by</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Duration</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]">Date</th>
                        <th className="text-left text-sm font-semibold text-gray-900 py-4 px-6 font-['Inter',sans-serif]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {testData.map((test) => (
                        <tr key={test.id} className="hover:bg-cyan-50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-600 font-['Inter',sans-serif]">
                            {test.testName}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 font-['Inter',sans-serif]">
                            {test.type}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full font-semibold text-xs font-large capitalize font-['Inter',sans-serif] ${getStatusColor(test.status)}`}>
                              {getStatusText(test.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 font-['Inter',sans-serif]">
                            {test.executedBy}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 font-['Inter',sans-serif]">
                            {test.duration}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 font-['Inter',sans-serif]">
                            {test.date}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {/* Edit Icon - Always present */}
                              <button 
                                className="transition-all duration-200 rounded p-1 text-[#000098] hover:bg-[rgba(0,0,152,0.1)]"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              
                              {/* Download Icon */}
                              {test.hasDownload && (
                                <button 
                                  className="transition-all duration-200 rounded p-1 text-[#000098] hover:bg-[rgba(0,0,152,0.1)]"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              
                              {/* Refresh Icon */}
                              {test.hasRefresh && (
                                <button 
                                  className="transition-all duration-200 rounded p-1 text-[#000098] hover:bg-[rgba(0,0,152,0.1)]"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Testing;
