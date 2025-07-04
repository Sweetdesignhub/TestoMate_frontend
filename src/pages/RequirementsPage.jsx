import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FaLaptopCode } from "react-icons/fa";
import { AiOutlineCloudUpload, AiTwotoneExperiment } from "react-icons/ai";
import { LuCircleFadingArrowUp } from "react-icons/lu";
import { GrDocumentTest } from "react-icons/gr";

export default function RequirementsPage() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Requirements");
  const [activeGenerationTab, setActiveGenerationTab] =
    useState("User Stories");
  const [prompt, setPrompt] = useState("");
  const [selectedProject, setSelectedProject] = useState("Healthcare Portal");

  const mainSidebarItems = [
    { name: "Home", icon: RiHome2Line, path: "/home" },
    { name: "Generative Agent", icon: MdBackupTable },
    { name: "Executions", icon: MdOutlineVerified },
    { name: "Integrations", icon: MdInsights },
    { name: "Reports", icon: TbReportAnalytics },
    { name: "Settings", icon: CiSettings },
  ];

  const projectSidebarItems = [
    { name: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
    { name: "Requirements", icon: MdChecklist, path: "/requirements" },
    { name: "Development", icon: FaLaptopCode, path: "/requirements" },
    { name: "Testing", icon: AiTwotoneExperiment, path: "/requirements" },
    { name: "Support", icon: MdOutline3P, path: "/requirements" },
    { name: "Release", icon: LuCircleFadingArrowUp, path: "/requirements" },
  ];

  const generationTabs = [
    { name: "User Stories" },
    { name: "Acceptance Criteria" },
    { name: "Test Cases" },
    { name: "Automation Scripts" },
  ];

  const projectOptions = [
    "Healthcare Portal",
    "E-commerce Platform",
    "Banking System",
    "Educational App",
  ];

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
        {/* Main Sidebar */}
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
                  navigate(item.path);
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
                <span>RSC</span>
                <span className="mx-2">/</span>
                <span className="text-red-600 font-medium">New Generation</span>
              </div>

              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  AI-Powered Generation for Your Project
                </h1>
                <div className="flex items-center space-x-4">
                  {/* Project Selector */}
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-4 py-2 border border-gray-300 font-medium cursor-pointer rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {projectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* History Button */}
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    History
                  </button>
                </div>
              </div>

              {/* Content Layout */}
              <div className="space-y-6">
                {/* Prompt Input Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="relative mb-6">
                    {/* Outer Box */}
                    <div className="border border-gray-300 rounded-lg pt-4 px-4 pb-2 bg-white">
                      {/* Inline Label inside top border */}
                      <div className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-700">
                        Prompt
                      </div>

                      {/* Textarea */}
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your requirements here... (e.g. Build a patient booking flow with payment integration)"
                        className="w-full h-16 border-none outline-none resize-none text-sm text-gray-700"
                      />

                      {/* Upload icon (optional) */}
                      <button className="absolute top-2 right-3 flex items-center cursor-pointer gap-1 px-2 py-1 border border-black rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm">
                        <span className="text-sm font-medium">Upload</span>
                        <AiOutlineCloudUpload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button className="w-full sm:w-auto px-4 py-2 bg-[#0089EB] cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    Generate test
                  </button>
                </div>

                {/* Generation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Tab Headers */}
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {generationTabs.map((tab) => (
                        <button
                          key={tab.name}
                          onClick={() => setActiveGenerationTab(tab.name)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                            tab.name === activeGenerationTab
                              ? "border-red-500 text-red-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <div className="min-h-[400px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <GrDocumentTest className="w-8 h-8" />
                        </div>
                        <p className="text-sm">
                          Generate {activeGenerationTab.toLowerCase()} by
                          entering your requirements above
                        </p>
                      </div>
                    </div>
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
