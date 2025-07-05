// import { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { RiHome2Line } from "react-icons/ri";
// import {
//   MdBackupTable,
//   MdChecklist,
//   MdInsights,
//   MdOutline3P,
//   MdOutlineDashboard,
//   MdOutlineVerified,
// } from "react-icons/md";
// import { TbReportAnalytics } from "react-icons/tb";
// import { CiSettings } from "react-icons/ci";
// import { FaLaptopCode } from "react-icons/fa";
// import { AiOutlineCloudUpload, AiTwotoneExperiment } from "react-icons/ai";
// import { LuCircleFadingArrowUp } from "react-icons/lu";
// import { GrDocumentTest } from "react-icons/gr";
// import { getStoryInfo } from "../utils/jiraApi";

// export default function RequirementsPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
//   const [activeSubTab, setActiveSubTab] = useState("Requirements");
//   const [activeGenerationTab, setActiveGenerationTab] =
//     useState("User Stories");
//   const [prompt, setPrompt] = useState("");
//   const [selectedProject, setSelectedProject] = useState("TestomatePOC");
//   const [storyData, setStoryData] = useState(null);
//   const [error, setError] = useState(null);

//   const mainSidebarItems = [
//     { name: "Home", icon: RiHome2Line, path: "/home" },
//     { name: "Generative Agent", icon: MdBackupTable },
//     { name: "Executions", icon: MdOutlineVerified },
//     { name: "Integrations", icon: MdInsights },
//     { name: "Reports", icon: TbReportAnalytics },
//     { name: "Settings", icon: CiSettings },
//   ];

//   const projectSidebarItems = [
//     { name: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
//     { name: "Requirements", icon: MdChecklist, path: "/requirements" },
//     { name: "Development", icon: FaLaptopCode, path: "/requirements" },
//     { name: "Testing", icon: AiTwotoneExperiment, path: "/requirements" },
//     { name: "Support", icon: MdOutline3P, path: "/requirements" },
//     { name: "Release", icon: LuCircleFadingArrowUp, path: "/requirements" },
//   ];

//   const generationTabs = [
//     { name: "User Stories" },
//     { name: "Acceptance Criteria" },
//     { name: "Test Cases" },
//     { name: "Automation Scripts" },
//   ];

//   const projectOptions = [
//     "TestomatePOC",
//     "E-commerce Platform",
//     "Banking System",
//     "Educational App",
//   ];

//   const handleGenerateTest = async () => {
//     const storyIdMatch = prompt.match(/(TES-\d+)/);
//     if (!storyIdMatch) {
//       setError(
//         "Please include a valid story ID (e.g., TES-123) in the prompt."
//       );
//       return;
//     }
//     const storyId = storyIdMatch[0];
//     try {
//       const story = await getStoryInfo(storyId);
//       setStoryData(story);
//       setError(null);
//     } catch (error) {
//       setError("Failed to fetch story details. Ensure the story ID is valid.");
//     }
//   };

//   useEffect(() => {
//     const foundTab = projectSidebarItems.find(
//       (item) => item.path === location.pathname
//     );
//     if (foundTab) {
//       setActiveSubTab(foundTab.name);
//     }
//   }, [location.pathname]);

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
//         {/* Main Sidebar */}
//         <div className="w-16 bg-white shadow-sm border-r border-gray-200 flex flex-col">
//           <nav className="flex-1 p-2 space-y-2">
//             {mainSidebarItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   setActiveMainTab(item.name);
//                   navigate(item.path);
//                 }}
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
//                   navigate(item.path);
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
//                 <Link
//                   to="/home"
//                   className="font-medium text-[#343434] cursor-pointer"
//                 >
//                   Home
//                 </Link>
//                 <span className="mx-2">/</span>
//                 <Link
//                   to="/dashboard"
//                   className="font-medium text-[#343434] cursor-pointer"
//                 >
//                   TES
//                 </Link>
//                 <span className="mx-2">/</span>
//                 <span className="text-red-600 font-medium">New Generation</span>
//               </div>

//               {/* Page Header */}
//               <div className="flex items-center justify-between mb-8">
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   AI-Powered Generation for Your Project
//                 </h1>
//                 <div className="flex items-center space-x-4">
//                   <select
//                     value={selectedProject}
//                     onChange={(e) => setSelectedProject(e.target.value)}
//                     className="px-4 py-2 border border-gray-300 font-medium cursor-pointer rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     {projectOptions.map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                   </select>
//                   <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     History
//                   </button>
//                 </div>
//               </div>

//               {/* Content Layout */}
//               <div className="space-y-6">
//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-100 text-red-700 p-4 rounded-lg">
//                     {error}
//                   </div>
//                 )}

//                 {/* Prompt Input Card */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                   <div className="relative mb-6">
//                     <div className="border border-gray-300 rounded-lg pt-4 px-4 pb-2 bg-white">
//                       <div className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-700">
//                         Prompt
//                       </div>
//                       <textarea
//                         value={prompt}
//                         onChange={(e) => {
//                           setPrompt(e.target.value);
//                           setError(null);
//                         }}
//                         placeholder="Enter a story ID (e.g., TES-123) or describe your requirements..."
//                         className="w-full h-16 border-none outline-none resize-none text-sm text-gray-700"
//                       />
//                       <button className="absolute top-2 right-3 flex items-center cursor-pointer gap-1 px-2 py-1 border border-black rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm">
//                         <span className="text-sm font-medium">Upload</span>
//                         <AiOutlineCloudUpload className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleGenerateTest}
//                     className="w-full sm:w-auto px-4 py-2 bg-[#0089EB] cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
//                   >
//                     Generate test
//                   </button>
//                 </div>

//                 {/* Generation Tabs */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                   <div className="border-b border-gray-200">
//                     <nav className="flex space-x-8 px-6">
//                       {generationTabs.map((tab) => (
//                         <button
//                           key={tab.name}
//                           onClick={() => setActiveGenerationTab(tab.name)}
//                           className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
//                             tab.name === activeGenerationTab
//                               ? "border-red-500 text-red-600"
//                               : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                           }`}
//                         >
//                           {tab.name}
//                         </button>
//                       ))}
//                     </nav>
//                   </div>
//                   <div className="p-6">
//                     <div className="min-h-[400px]">
//                       {storyData ? (
//                         <div className="text-gray-700">
//                           <h3 className="text-lg font-semibold">
//                             Story: {storyData.key}
//                           </h3>
//                           <p>
//                             <strong>Summary:</strong> {storyData.summary}
//                           </p>
//                           <p>
//                             <strong>Description:</strong>{" "}
//                             {storyData.description}
//                           </p>
//                           <p>
//                             <strong>Status:</strong> {storyData.status}
//                           </p>
//                           <p>
//                             <strong>Assignee:</strong> {storyData.assignee}
//                           </p>
//                           <p>
//                             <strong>Created:</strong>{" "}
//                             {new Date(storyData.created).toLocaleString()}
//                           </p>
//                           <p>
//                             <strong>Updated:</strong>{" "}
//                             {new Date(storyData.updated).toLocaleString()}
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="text-center text-gray-500">
//                           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                             <GrDocumentTest className="w-8 h-8" />
//                           </div>
//                           <p className="text-sm">
//                             Generate {activeGenerationTab.toLowerCase()} by
//                             entering a story ID above
//                           </p>
//                         </div>
//                       )}
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
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AiOutlineCloudUpload, AiTwotoneExperiment } from "react-icons/ai";
import { GrDocumentTest } from "react-icons/gr";
import { getStoryInfo, getAllProjects, getProjectInfo } from "../utils/jiraApi";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import Header from "../components/Header";

export default function RequirementsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Requirements");
  const [activeGenerationTab, setActiveGenerationTab] =
    useState("User Stories");
  const [prompt, setPrompt] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projectKey, setProjectKey] = useState(
    location.state?.projectKey || "Unknown Project"
  );
  const [projectName, setProjectName] = useState(projectKey); // Initialize with projectKey as fallback
  const [projects, setProjects] = useState([]);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const generationTabs = [
    { name: "User Stories" },
    { name: "Acceptance Criteria" },
    { name: "Test Cases" },
    { name: "Automation Scripts" },
  ];

  // Fetch projects from Jira
  useEffect(() => {
    async function fetchProjects() {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
        // Set the initial selected project to the one from location.state or the first project
        if (allProjects.length > 0) {
          const initialProject =
            allProjects.find((p) => p.key === projectKey) || allProjects[0];
          setSelectedProject(initialProject.name);
          setProjectKey(initialProject.key);
        }
        setError(null);
      } catch (error) {
        setError(
          error.response?.status === 401
            ? "Unauthorized: Invalid Jira credentials."
            : "Failed to fetch projects from Jira."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Fetch project name based on projectKey
  useEffect(() => {
    async function fetchProjectName() {
      try {
        if (projectKey !== "Unknown Project") {
          const projectInfo = await getProjectInfo(projectKey);
          setProjectName(projectInfo.name);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error.message);
        setProjectName(projectKey); // Fallback to projectKey if fetching fails
        setError("Failed to fetch project name from Jira.");
      }
    }
    fetchProjectName();
  }, [projectKey]);

  // Update projectKey when selectedProject changes
  useEffect(() => {
    const selected = projects.find((p) => p.name === selectedProject);
    if (selected) {
      setProjectKey(selected.key);
    }
  }, [selectedProject, projects]);

  const handleGenerateTest = async () => {
    const storyIdMatch = prompt.match(/(TES-\d+)/);
    if (!storyIdMatch) {
      setError(
        "Please include a valid story ID (e.g., TES-123) in the prompt."
      );
      return;
    }
    const storyId = storyIdMatch[0];
    try {
      const story = await getStoryInfo(storyId);
      setStoryData(story);
      setError(null);
    } catch (error) {
      setError(
        error.response?.status === 404
          ? "Story not found. Ensure the story ID is valid."
          : error.response?.status === 401
          ? "Unauthorized: Invalid Jira credentials."
          : "Failed to fetch story details from Jira."
      );
    }
  };

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

        {/* Project Sidebar */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Breadcrumb */}
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
                  state={{ projectKey }} // Pass projectKey in state
                  className="font-medium text-[#343434] cursor-pointer"
                >
                  {projectName}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-red-600 font-medium">New Generation</span>
              </div>

              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  AI-Powered Generation for Your Project
                </h1>
                <div className="flex items-center space-x-4">
                  {loading ? (
                    <span>Loading projects...</span>
                  ) : (
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="px-4 py-2 border border-gray-300 font-medium cursor-pointer rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {projects.map((project) => (
                        <option key={project.key} value={project.name}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  )}
                  <button className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    History
                  </button>
                </div>
              </div>

              {/* Content Layout */}
              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Prompt Input Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="relative mb-6">
                    <div className="border border-gray-300 rounded-lg pt-4 px-4 pb-2 bg-white">
                      <div className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-700">
                        Prompt
                      </div>
                      <textarea
                        value={prompt}
                        onChange={(e) => {
                          setPrompt(e.target.value);
                          setError(null);
                        }}
                        placeholder="Enter a story ID (e.g., TES-123) or describe your requirements..."
                        className="w-full h-16 border-none outline-none resize-none text-sm text-gray-700"
                      />
                      <button className="absolute top-2 right-3 flex items-center cursor-pointer gap-1 px-2 py-1 border border-black rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm">
                        <span className="text-sm font-medium">Upload</span>
                        <AiOutlineCloudUpload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateTest}
                    className="w-full sm:w-auto px-4 py-2 bg-[#0089EB] cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Generate test
                  </button>
                </div>

                {/* Generation Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  <div className="p-6">
                    <div className="min-h-[400px]">
                      {storyData ? (
                        <div className="text-gray-700">
                          <h3 className="text-lg font-semibold">
                            Story: {storyData.key}
                          </h3>
                          <p>
                            <strong>Summary:</strong> {storyData.summary}
                          </p>
                          <p>
                            <strong>Description:</strong>{" "}
                            {storyData.description ||
                              "No description available"}
                          </p>
                          <p>
                            <strong>Status:</strong> {storyData.status}
                          </p>
                          <p>
                            <strong>Assignee:</strong>{" "}
                            {storyData.assignee || "Unassigned"}
                          </p>
                          <p>
                            <strong>Created:</strong>{" "}
                            {new Date(storyData.created).toLocaleString()}
                          </p>
                          <p>
                            <strong>Updated:</strong>{" "}
                            {new Date(storyData.updated).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <GrDocumentTest className="w-8 h-8" />
                          </div>
                          <p className="text-sm">
                            Generate {activeGenerationTab.toLowerCase()} by
                            entering a story ID above
                          </p>
                        </div>
                      )}
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
