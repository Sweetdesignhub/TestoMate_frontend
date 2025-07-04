// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MoreHorizontal, RefreshCw, Edit3 } from "lucide-react";
// import { RiHome2Line } from "react-icons/ri";
// import { MdBackupTable, MdInsights, MdOutlineVerified } from "react-icons/md";
// import { TbReportAnalytics } from "react-icons/tb";
// import { CiSettings } from "react-icons/ci";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import totalTests from "../assets/total_tests.png";
// import passedTests from "../assets/passed_tests.png";
// import faieldTests from "../assets/failed_tests.png";
// import avgExecTime from "../assets/avg_time.png";

// export default function Dashboard() {
//   const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
//   const [activeSubTab, setActiveSubTab] = useState("Dashboard");
//   const navigate = useNavigate();

//   const mainSidebarItems = [
//     { name: "Home", icon: RiHome2Line, active: false },
//     { name: "Generative Agent", icon: MdBackupTable, active: true },
//     { name: "Executions", icon: MdOutlineVerified, active: false },
//     { name: "Integrations", icon: MdInsights, active: false },
//     { name: "Reports", icon: TbReportAnalytics, active: false },
//     { name: "Settings", icon: CiSettings, active: false },
//   ];

//   const projectSidebarItems = [
//     { name: "Dashboard", icon: MdBackupTable, active: true },
//     { name: "Requirements", icon: MdOutlineVerified, active: false },
//     { name: "Development", icon: MdInsights, active: false },
//     { name: "Testing", icon: TbReportAnalytics, active: false },
//     { name: "Support", icon: CiSettings, active: false },
//     { name: "Release", icon: CiSettings, active: false },
//   ];

//   const tabRoutes = {
//     Dashboard: "/dashboard",
//     Requirements: "/requirements",
//     Development: "/development",
//     Testing: "/testing",
//     Support: "/support",
//     Release: "/release",
//   };

//   const statsCards = [
//     {
//       title: "Total Tests",
//       value: "1220",
//       icon: totalTests,
//     },
//     {
//       title: "Passed Tests",
//       value: "920",
//       icon: passedTests,
//     },
//     {
//       title: "Failed Tests",
//       value: "180",
//       icon: faieldTests,
//     },
//     {
//       title: "Avg. Execution Time",
//       value: "1m 18s",
//       icon: avgExecTime,
//     },
//   ];

//   const executionData = [
//     { date: "25/06", passed: 250, failed: 50, total: 300 },
//     { date: "24/06", passed: 280, failed: 70, total: 350 },
//     { date: "23/06", passed: 200, failed: 80, total: 280 },
//     { date: "22/06", passed: 220, failed: 60, total: 280 },
//     { date: "21/06", passed: 180, failed: 40, total: 220 },
//   ];

//   const failedTests = [
//     {
//       name: "Login Page Validation",
//       type: "Functional",
//       executor: "Ralph Edwards",
//       duration: "8m 43s",
//       date: "22.05.2020, 13:00",
//     },
//     {
//       name: "Checkout Payment Gateway",
//       type: "System",
//       executor: "Guy Hawkins",
//       duration: "2m 43s",
//       date: "22.03.2020, 04:00",
//     },
//     {
//       name: "Doctor Flow BST",
//       type: "Functional",
//       executor: "Jane Cooper",
//       duration: "21m 40s",
//       date: "18.02.2020, 13:00",
//     },
//     {
//       name: "Add to Cart Validation",
//       type: "Unit",
//       executor: "Robert Fox",
//       duration: "16m 36s",
//       date: "10.04.2020, 12:45",
//     },
//     {
//       name: "Doctor Case Simulation",
//       type: "Business Sim",
//       executor: "Jerome Bell",
//       duration: "3m 41s",
//       date: "11.04.2020, 17:30",
//     },
//   ];

//   // Chart data for pie chart
//   const chartData = [
//     { name: "Passed", value: 920, color: "#10B981" },
//     { name: "Failed", value: 180, color: "#EF4444" },
//     { name: "Skipped", value: 60, color: "#F59E0B" },
//     { name: "Blocked", value: 30, color: "#8B5CF6" },
//   ];

//   const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Global Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <h1 className="text-xl font-bold text-gray-900">Testomate</h1>
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <span className="text-white text-sm font-medium">U</span>
//           </div>
//         </div>
//       </header>

//       {/* Main Layout */}
//       <div className="flex flex-1">
//         {/* Main Sidebar - Collapsed */}
//         <div className="w-16 bg-white shadow-sm border-r border-gray-200 flex flex-col">
//           <nav className="flex-1 p-2 space-y-2">
//             {mainSidebarItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => setActiveMainTab(item.name)}
//                 className={`w-full flex items-center justify-center cursor-pointer p-3 rounded-lg transition-colors ${
//                   item.name === activeMainTab
//                     ? "bg-red-50 text-red-600 border-2 border-red-600"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//                 title={item.name}
//               >
//                 <item.icon className="w-5 h-5" />
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Project Sidebar */}
//         <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
//           <nav className="flex-1 p-4 space-y-2">
//             {projectSidebarItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   setActiveSubTab(item.name);
//                   if (tabRoutes[item.name]) {
//                     navigate(tabRoutes[item.name]);
//                   }
//                 }}
//                 className={`w-full flex items-center cursor-pointer px-3 py-2 text-left rounded-lg transition-colors ${
//                   item.name === activeSubTab
//                     ? "bg-red-50 font-medium text-red-600 border-l-4 border-red-600"
//                     : "font-medium hover:bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <main className="flex-1 overflow-y-auto">
//             <div className="p-6">
//               {/* Breadcrumb */}
//               <div className="flex items-center text-sm text-gray-500 mb-6">
//                 <span>Home</span>
//                 <span className="mx-2">/</span>
//                 <span className="text-gray-900">RSC</span>
//               </div>

//               {/* Page Title */}
//               <h1 className="text-3xl font-bold text-gray-900 mb-8">
//                 Dashboard
//               </h1>

//               {/* Stats Cards + Execution Timeline Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
//                 {/* Stats Cards - First 3 Columns */}
//                 <div className="lg:col-span-3">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
//                     {statsCards.map((card, index) => (
//                       <div
//                         key={index}
//                         className="bg-white rounded-lg p-6 relative shadow-sm border border-gray-200 h-[200px] flex flex-col justify-between"
//                       >
//                         {/* Icon - Top Right */}
//                         <div className="flex justify-end">
//                           <img
//                             src={card.icon}
//                             alt={`${card.title} icon`}
//                             className="w-20 h-20 top-0 right-0 absolute"
//                           />
//                         </div>

//                         {/* Content - Bottom */}
//                         <div className="flex flex-col">
//                           <h3 className="text-3xl font-bold text-gray-900 mb-2">
//                             {card.value}
//                           </h3>
//                           <p className="text-sm text-gray-600 font-medium">
//                             {card.title}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Execution Timeline - Last 2 Columns */}
//                 <div className="lg:col-span-2">
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[200px] flex flex-col">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         Execution
//                       </h3>
//                       <div className="flex items-center space-x-4 text-xs">
//                         <div className="flex items-center">
//                           <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                           <span className="text-gray-600">Passed</span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
//                           <span className="text-gray-600">Failed</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                           data={executionData}
//                           margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
//                         >
//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#f0f0f0"
//                           />
//                           <XAxis
//                             dataKey="date"
//                             tick={{ fontSize: 10 }}
//                             axisLine={false}
//                             tickLine={false}
//                           />
//                           <YAxis hide />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                               fontSize: "12px",
//                             }}
//                           />
//                           <Bar
//                             dataKey="passed"
//                             stackId="a"
//                             fill="#10B981"
//                             radius={[0, 0, 0, 0]}
//                           />
//                           <Bar
//                             dataKey="failed"
//                             stackId="a"
//                             fill="#EF4444"
//                             radius={[4, 4, 0, 0]}
//                           />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Charts and Tables Row */}
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//                 {/* Execution Chart */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 xl:col-span-1">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Execution
//                   </h3>
//                   <div className="relative">
//                     {/* Pie Chart */}
//                     <div className="relative h-64">
//                       {/* Center text */}
//                       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
//                         <span className="text-2xl font-bold text-gray-900">
//                           {chartData.reduce((sum, item) => sum + item.value, 0)}
//                         </span>
//                         <span className="text-sm text-gray-600">Tests</span>
//                       </div>

//                       {/* Pie Chart behind center text */}
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={chartData}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={60}
//                             outerRadius={90}
//                             paddingAngle={2}
//                             dataKey="value"
//                           >
//                             {chartData.map((entry, index) => (
//                               <Cell
//                                 key={`cell-${index}`}
//                                 fill={COLORS[index % COLORS.length]}
//                               />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                               fontSize: "12px",
//                             }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>

//                     {/* Legend */}
//                     <div className="space-y-3">
//                       {chartData.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between"
//                         >
//                           <div className="flex items-center">
//                             <div
//                               className="w-3 h-3 rounded-full mr-3"
//                               style={{ backgroundColor: COLORS[index] }}
//                             ></div>
//                             <span className="text-sm text-gray-600">
//                               {item.name}
//                             </span>
//                           </div>
//                           <span className="text-sm font-medium text-gray-900">
//                             {item.value}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Failed Executions Header (outside the card) */}
//                 <div className="xl:col-span-2 space-y-4">
//                   {/* Heading outside the card */}
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       Failed Executions
//                     </h3>
//                     <button className="text-sm text-blue-600 hover:text-blue-700">
//                       View all tests
//                     </button>
//                   </div>

//                   {/* Card with table */}
//                   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b border-gray-200">
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Test Name
//                             </th>
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Type
//                             </th>
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Executed by
//                             </th>
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Duration
//                             </th>
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Date
//                             </th>
//                             <th className="text-left text-xs font-medium text-gray-500 pb-3">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                           {failedTests.map((test, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                               <td className="py-3 text-sm text-gray-900 font-medium">
//                                 {test.name}
//                               </td>
//                               <td className="py-3 text-sm text-gray-600">
//                                 {test.type}
//                               </td>
//                               <td className="py-3 text-sm text-gray-600">
//                                 {test.executor}
//                               </td>
//                               <td className="py-3 text-sm text-gray-600">
//                                 {test.duration}
//                               </td>
//                               <td className="py-3 text-sm text-gray-600">
//                                 {test.date}
//                               </td>
//                               <td className="py-3">
//                                 <div className="flex items-center space-x-2">
//                                   <button className="text-gray-400 hover:text-gray-600">
//                                     <Edit3 className="w-4 h-4" />
//                                   </button>
//                                   <button className="text-gray-400 hover:text-gray-600">
//                                     <RefreshCw className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MoreHorizontal, RefreshCw, Edit3 } from "lucide-react";
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
  Legend,
} from "recharts";
import totalTests from "../assets/total_tests.png";
import passedTests from "../assets/passed_tests.png";
import faieldTests from "../assets/failed_tests.png";
import avgExecTime from "../assets/avg_time.png";
import { FaLaptopCode } from "react-icons/fa";
import { AiTwotoneExperiment } from "react-icons/ai";
import { LuCircleFadingArrowUp } from "react-icons/lu";

export default function Dashboard() {
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const mainSidebarItems = [
    { name: "Home", icon: RiHome2Line, path: "/home", active: false },
    { name: "Generative Agent", icon: MdBackupTable, active: true },
    { name: "Executions", icon: MdOutlineVerified, active: false },
    { name: "Integrations", icon: MdInsights, active: false },
    { name: "Reports", icon: TbReportAnalytics, active: false },
    { name: "Settings", icon: CiSettings, active: false },
  ];

  const projectSidebarItems = [
    { name: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
    { name: "Requirements", icon: MdChecklist, path: "/requirements" },
    { name: "Development", icon: FaLaptopCode, path: "/dashboard" },
    { name: "Testing", icon: AiTwotoneExperiment, path: "/dashboard" },
    { name: "Support", icon: MdOutline3P, path: "/dashboard" },
    { name: "Release", icon: LuCircleFadingArrowUp, path: "/dashboard" },
  ];

  const statsCards = [
    {
      title: "Total Tests",
      value: "1220",
      icon: totalTests,
    },
    {
      title: "Passed Tests",
      value: "920",
      icon: passedTests,
    },
    {
      title: "Failed Tests",
      value: "180",
      icon: faieldTests,
    },
    {
      title: "Avg. Execution Time",
      value: "1m 18s",
      icon: avgExecTime,
    },
  ];

  const executionData = [
    { date: "25/06", passed: 250, failed: 50, total: 300 },
    { date: "24/06", passed: 280, failed: 70, total: 350 },
    { date: "23/06", passed: 200, failed: 80, total: 280 },
    { date: "22/06", passed: 220, failed: 60, total: 280 },
    { date: "21/06", passed: 180, failed: 40, total: 220 },
  ];

  const failedTests = [
    {
      name: "Login Page Validation",
      type: "Functional",
      executor: "Ralph Edwards",
      duration: "8m 43s",
      date: "22.05.2020, 13:00",
    },
    {
      name: "Checkout Payment Gateway",
      type: "System",
      executor: "Guy Hawkins",
      duration: "2m 43s",
      date: "22.03.2020, 04:00",
    },
    {
      name: "Doctor Flow BST",
      type: "Functional",
      executor: "Jane Cooper",
      duration: "21m 40s",
      date: "18.02.2020, 13:00",
    },
    {
      name: "Add to Cart Validation",
      type: "Unit",
      executor: "Robert Fox",
      duration: "16m 36s",
      date: "10.04.2020, 12:45",
    },
    {
      name: "Doctor Case Simulation",
      type: "Business Sim",
      executor: "Jerome Bell",
      duration: "3m 41s",
      date: "11.04.2020, 17:30",
    },
  ];

  // Chart data for pie chart
  const chartData = [
    { name: "Passed", value: 920, color: "#10B981" },
    { name: "Failed", value: 180, color: "#EF4444" },
    { name: "Skipped", value: 60, color: "#F59E0B" },
    { name: "Blocked", value: 30, color: "#8B5CF6" },
  ];

  useEffect(() => {
    const foundTab = projectSidebarItems.find(
      (item) => item.path === location.pathname
    );
    if (foundTab) {
      setActiveSubTab(foundTab.name);
    }
  }, [location.pathname]);

  const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Testomate</h1>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Main Sidebar - Collapsed */}
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

        {/* Project Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {projectSidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveSubTab(item.name);
                  if (item.path && location.pathname !== item.path) {
                    navigate(item.path);
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span className="text-red-600 font-medium">RSC</span>
              </div>

              {/* Page Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard
              </h1>

              {/* Stats Cards + Execution Timeline Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
                {/* Stats Cards - First 3 Columns */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
                    {statsCards.map((card, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 relative shadow-sm border border-gray-200 h-[200px] flex flex-col justify-between"
                      >
                        {/* Icon - Top Right */}
                        <div className="flex justify-end">
                          <img
                            src={card.icon}
                            alt={`${card.title} icon`}
                            className="w-20 h-20 top-0 right-0 absolute"
                          />
                        </div>

                        {/* Content - Bottom */}
                        <div className="flex flex-col">
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {card.value}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Timeline - Last 2 Columns */}
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
                      </div>
                    </div>

                    <div className="flex-1">
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
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Tables Row */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Execution Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 xl:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Execution
                  </h3>
                  <div className="relative">
                    {/* Pie Chart */}
                    <div className="relative h-64">
                      {/* Center text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold text-gray-900">
                          920
                        </span>
                        <span className="text-gray-600 font-medium">
                          Passed Tests
                        </span>
                      </div>

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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Legend */}
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
                            <span className="text-sm text-gray-600">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Failed Tests Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 xl:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Failed Tests
                    </h3>
                    <div className="flex space-x-4 text-gray-600">
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Refresh"
                      >
                        <RefreshCw size={20} />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Edit"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="More Options"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Test Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Test Type
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Executor
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Duration
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {failedTests.map((test, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {test.name}
                            </td>
                            <td className="px-6 py-4">{test.type}</td>
                            <td className="px-6 py-4">{test.executor}</td>
                            <td className="px-6 py-4">{test.duration}</td>
                            <td className="px-6 py-4">{test.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
