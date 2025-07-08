import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { GrDocumentTest } from "react-icons/gr";
import { getAllProjects, getProjectInfo } from "../utils/jiraApi";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import Header from "../components/Header";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdContentCopy } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

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
  const [generationResults, setGenerationResults] = useState({});
  const [generationLoading, setGenerationLoading] = useState({});
  const [generationErrors, setGenerationErrors] = useState({});
  const [editedResults, setEditedResults] = useState({});
  const [editMode, setEditMode] = useState({});
  const fileInputRef = useRef(null);
  const [copiedTab, setCopiedTab] = useState(null);
  const [justSaved, setJustSaved] = useState({});
  const textareaRef = useRef(null);

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

  // Update editedResults when generationResults change
  useEffect(() => {
    Object.entries(generationResults).forEach(([tab, result]) => {
      setEditedResults((prev) => {
        // Only set if not already edited (preserve user edits)
        if (prev[tab] === undefined) {
          return { ...prev, [tab]: result };
        }
        return prev;
      });
    });
  }, [generationResults]);

  const handleEditResult = (tab, value) => {
    setEditedResults((prev) => ({ ...prev, [tab]: value }));
  };

  const handleCopy = async (tab) => {
    try {
      await navigator.clipboard.writeText(editedResults[tab] || "");
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 1500);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const handlePushToJira = (tab) => {
    // Stub: Replace with actual Jira push logic
    alert(`Pushing to Jira for ${tab}:\n\n${editedResults[tab] || ""}`);
  };

  const handleEditToggle = (tab) => {
    setEditMode((prev) => {
      const isEditing = prev[tab];
      if (isEditing) {
        // Just saved
        setJustSaved((prevSaved) => ({ ...prevSaved, [tab]: true }));
        setTimeout(() => {
          setJustSaved((prevSaved) => ({ ...prevSaved, [tab]: false }));
        }, 2000);
      }
      return { ...prev, [tab]: !isEditing };
    });
  };

  const handleGenerateTest = async () => {
    setError(null);
    if (!prompt.trim()) {
      setError("Please enter a requirement or story ID.");
      return;
    }
    const endpoints = {
      "User Stories": {
        endpoint: "/jira_user_story",
        payload: { requirement: prompt },
      },
      "Acceptance Criteria": {
        endpoint: "/acceptance_criteria",
        payload: { requirement: prompt },
      },
      "Test Cases": {
        endpoint: "/test_cases",
        payload: { requirement: prompt },
      },
      "Automation Scripts": {
        endpoint: "/automation_script",
        payload: { requirement: prompt, framework: "Selenium (Python)" },
      },
    };
    // Set loading true for all
    setGenerationLoading({
      "User Stories": true,
      "Acceptance Criteria": true,
      "Test Cases": true,
      "Automation Scripts": true,
    });
    setGenerationErrors({});
    // Send all requests in parallel
    await Promise.all(
      Object.entries(endpoints).map(async ([tab, { endpoint, payload }]) => {
        try {
          const res = await axios.post(
            `http://localhost:8000${endpoint}`,
            payload
          );
          setGenerationResults((prev) => ({ ...prev, [tab]: res.data.result }));
          setGenerationErrors((prev) => ({ ...prev, [tab]: undefined }));
        } catch (err) {
          setGenerationErrors((prev) => ({
            ...prev,
            [tab]:
              err.response?.data?.detail ||
              err.message ||
              "Failed to generate result. Please try again.",
          }));
        } finally {
          setGenerationLoading((prev) => ({ ...prev, [tab]: false }));
        }
      })
    );
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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

  // Helper to check if any generation is loading
  const isAnyGenerationLoading = Object.values(generationLoading).some(Boolean);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = null; // reset
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "text/plain",
      "text/markdown",
      "text/x-markdown",
      "application/octet-stream",
    ]; // .txt, .md
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".md") &&
      !file.name.endsWith(".txt")
    ) {
      setError("Unsupported file type. Please upload a .txt or .md file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPrompt(event.target.result);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsText(file);
  };

  // Helper to render bold markdown (**text**) as <strong>text</strong>
  function renderBoldMarkdown(text) {
    if (!text) return "";
    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

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
                    <div className="border border-gray-300 rounded-lg pt-4 px-4 pb-2 pr-24 bg-white">
                      <div className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-700">
                        Prompt
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Enter a story ID (e.g., TES-123) or describe your requirements..."
                        className="w-full max-h-40 overflow-auto border-none outline-none resize-none text-sm text-gray-700 pr-4"
                        style={{ minHeight: "3rem" }}
                      />

                      <input
                        type="file"
                        accept=".txt,.md,text/plain,text/markdown,text/x-markdown"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <button
                        className="absolute top-2 right-3 flex items-center cursor-pointer gap-1 px-2 py-1 border border-black rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm bg-white"
                        onClick={handleUploadClick}
                        type="button"
                      >
                        <span className="text-sm font-medium">Upload</span>
                        <AiOutlineCloudUpload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateTest}
                    className="w-full sm:w-auto px-4 py-2 bg-[#0089EB] cursor-pointer text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    disabled={isAnyGenerationLoading}
                    style={
                      isAnyGenerationLoading
                        ? { opacity: 0.6, cursor: "not-allowed" }
                        : {}
                    }
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
                      {generationLoading[activeGenerationTab] ? (
                        <div className="flex items-center justify-center h-40 text-gray-500">
                          Generating...
                        </div>
                      ) : generationErrors[activeGenerationTab] ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                          {generationErrors[activeGenerationTab]}
                        </div>
                      ) : generationResults[activeGenerationTab] ? (
                        // <div>
                        //   {editMode[activeGenerationTab] ? (
                        //     <textarea
                        //       className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 bg-gray-50 resize-none mb-2"
                        //       value={editedResults[activeGenerationTab] || ""}
                        //       onChange={(e) => handleEditResult(activeGenerationTab, e.target.value)}
                        //       style={{ backgroundColor: '#fff' }}
                        //     />
                        //   ) : (
                        //     <div
                        //       className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 bg-gray-50 mb-2 overflow-auto whitespace-pre-wrap"
                        //       style={{ minHeight: '24rem' }}
                        //       dangerouslySetInnerHTML={{ __html: renderBoldMarkdown(editedResults[activeGenerationTab]) }}
                        //     />
                        //   )}
                        //   <div className="flex gap-2 mb-2 justify-end">
                        //     <button
                        //       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                        //       onClick={() => handlePushToJira(activeGenerationTab)}
                        //       type="button"
                        //     >
                        //       Push to Jira
                        //     </button>
                        //     <button
                        //       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                        //       onClick={() => handleEditToggle(activeGenerationTab)}
                        //       type="button"
                        //     >
                        //       {editMode[activeGenerationTab] ? 'Save' : 'Edit'}
                        //     </button>
                        //     <button
                        //       className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                        //       onClick={() => handleCopy(activeGenerationTab)}
                        //       type="button"
                        //     >
                        //       Copy
                        //     </button>
                        //   </div>
                        // </div>
                        <div className="flex gap-4 mb-2">
                          {/* Left: Content area */}
                          <div className="flex-1">
                            {editMode[activeGenerationTab] ? (
                              <textarea
                                className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 bg-gray-50 resize-none"
                                value={editedResults[activeGenerationTab] || ""}
                                onChange={(e) =>
                                  handleEditResult(
                                    activeGenerationTab,
                                    e.target.value
                                  )
                                }
                                style={{ backgroundColor: "#fff" }}
                              />
                            ) : (
                              <div
                                className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 overflow-auto whitespace-pre-wrap"
                                style={{ minHeight: "24rem" }}
                                dangerouslySetInnerHTML={{
                                  __html: renderBoldMarkdown(
                                    editedResults[activeGenerationTab]
                                  ),
                                }}
                              />
                            )}
                          </div>

                          {/* Right: Buttons */}
                          <div className="flex flex-col gap-2 justify-start">
                            <button
                              className="px-4 py-2 bg-[#0089EB] cursor-pointer text-white rounded-lg hover:bg-[#007acc] text-sm font-medium"
                              onClick={() =>
                                handlePushToJira(activeGenerationTab)
                              }
                              type="button"
                            >
                              Push to Jira
                            </button>
                            <button
                              className="text-sm font-medium flex cursor-pointer items-center pl-8 gap-x-1 transition-transform duration-150"
                              onClick={() =>
                                handleEditToggle(activeGenerationTab)
                              }
                              type="button"
                            >
                              {editMode[activeGenerationTab] ? (
                                <IoSaveOutline className="w-4 h-4" />
                              ) : (
                                <CiEdit className="w-4 h-4" />
                              )}
                              {justSaved[activeGenerationTab] ? (
                                <span className="text-green-600 font-medium animate-pulse">
                                  Saved
                                </span>
                              ) : editMode[activeGenerationTab] ? (
                                "Save"
                              ) : (
                                "Edit"
                              )}
                            </button>

                            <button
                              className="text-sm font-medium flex items-center cursor-pointer pl-8 gap-x-1 transition-all duration-300 ease-in-out"
                              onClick={() => handleCopy(activeGenerationTab)}
                              type="button"
                            >
                              {copiedTab === activeGenerationTab ? (
                                <TiTick className="w-4 h-4 text-green-600" />
                              ) : (
                                <MdContentCopy className="w-4 h-4" />
                              )}
                              <span
                                className={`transition-all duration-300 ${
                                  copiedTab === activeGenerationTab
                                    ? "text-green-600"
                                    : ""
                                }`}
                              >
                                {copiedTab === activeGenerationTab
                                  ? "Copied"
                                  : "Copy"}
                              </span>
                            </button>
                          </div>
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
