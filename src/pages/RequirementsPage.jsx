import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  AiOutlineCloudUpload,
  AiOutlineFile,
  AiOutlineClose,
} from "react-icons/ai";
import { GrDocumentTest } from "react-icons/gr";
import { getAllProjects, getProjectInfo } from "../utils/jiraApi";
import { mainSidebarItems, projectSidebarItems } from "../utils/constants";
import Header from "../components/Header";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdContentCopy } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import ErrorBoundary from "../components/ErrorBoundary";

// Debounce function to limit API calls
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Add at the top of the file, outside the component
const projectContentCache = {};

export default function RequirementsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMainTab, setActiveMainTab] = useState("Generative Agent");
  const [activeSubTab, setActiveSubTab] = useState("Requirements");
  const [activeGenerationTab, setActiveGenerationTab] = useState(
    "User Stories & Acceptance Criteria"
  );
  const [prompt, setPrompt] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [projectKey, setProjectKey] = useState(
    location.state?.projectKey || "Unknown Project"
  );
  const [projectName, setProjectName] = useState(projectKey);
  const [projects, setProjects] = useState([]);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generationResults, setGenerationResults] = useState({});
  const [generationLoading, setGenerationLoading] = useState({});
  const [generationErrors, setGenerationErrors] = useState({});
  const [editedResults, setEditedResults] = useState({});
  const [editMode, setEditMode] = useState({});
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const [copiedTab, setCopiedTab] = useState(null);
  const [justSaved, setJustSaved] = useState({});
  const textareaRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedScriptLanguage, setSelectedScriptLanguage] =
    useState("Python");
  const scriptLanguages = ["Python", "Java", "JavaScript", "C#"];
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [showJiraConfirm, setShowJiraConfirm] = useState(false);
  const [jiraSuccess, setJiraSuccess] = useState(null); // { id, url }

  // Add new state for the four fields at the top of the component
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [acceptance, setAcceptance] = useState("");

  // Add userStoryText state
  const [userStoryText, setUserStoryText] = useState("");

  // Add new state for the eleven fields at the top of the component
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("");
  const [parent, setParent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");
  const [team, setTeam] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sprint, setSprint] = useState("");
  const [storyPointEstimate, setStoryPointEstimate] = useState("");
  const [developement, setDevelopement] = useState("");
  const [reports, setReports] = useState("");

  const generationTabs = [
    { name: "User Stories & Acceptance Criteria" },
    { name: "Test Cases" },
    { name: "Automation Scripts" },
  ];

  // Fetch projects from Jira
  useEffect(() => {
    async function fetchProjects() {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
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
          console.log("Valid issue types for project:", projectInfo.issueTypes);
          setProjectName(projectInfo.name);
        }
      } catch (error) {
        console.error("Failed to fetch project name:", error.message);
        setProjectName(projectKey);
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
        if (prev[tab] === undefined) {
          return { ...prev, [tab]: result };
        }
        return prev;
      });
    });
  }, [generationResults]);

  // Save generated content as Draft for User Stories only (debounced)
  const saveDraft = debounce(async () => {
    const tab = "User Stories & Acceptance Criteria";
    const content = generationResults[tab];
    if (!content) return;

    // Extract title from content (look for "Title:" line or use default)
    let title = "User Story";
    if (typeof content === "string") {
      const match = content.match(/Title:\s*(.+?)(?:\n|$)/);
      if (match && match[1]) {
        title = match[1].substring(0, 100);
      } else {
        title = content.split("\n")[0].substring(0, 100);
      }
    } else if (typeof content === "object" && content.title) {
      title = content.title.substring(0, 100);
    }

    try {
      // Check if draft already exists in the database
      const response = await axios.get(
        `http://localhost:3000/api/jira/history/${projectKey}`
      );
      const existingDraft = response.data.some(
        (h) => h.type === tab && h.content === content && h.status === "Draft"
      );
      if (existingDraft) {
        console.log("Draft already exists, skipping save.");
        return;
      }

      await axios.post("http://localhost:3000/api/jira/history/draft", {
        projectKey,
        type: tab,
        title,
        content:
          typeof content === "object" ? JSON.stringify(content) : content,
        status: "Draft",
      });
      setError(null);
      // Refetch history to update local state
      const historyResponse = await axios.get(
        `http://localhost:3000/api/jira/history/${projectKey}`
      );
      setHistory(historyResponse.data);
    } catch (error) {
      console.error("Failed to save draft:", error.message);
      setError("Failed to save draft. Please try again.");
    }
  }, 1000);

  const handlePushToJira = async (tab) => {
    setJiraSuccess(null);
    setError(null);
    setShowJiraConfirm(true);
    // The actual push will be handled in handleConfirmPushToJira
  };

  const handleConfirmPushToJira = async (tab) => {
    setShowJiraConfirm(false);
    try {
      if (tab === "User Stories & Acceptance Criteria") {
        if (!title || !description || !priority) {
          setError("Missing required fields for Jira issue creation.");
          return;
        }
        // Robustly handle labels: if array, use as-is; if string, split
        let labelsArray = [];
        if (Array.isArray(labels)) {
          labelsArray = labels.map(l => l.trim()).filter(Boolean);
        } else if (typeof labels === "string") {
          labelsArray = labels.split(/,|;/).map(l => l.trim()).filter(Boolean);
        }
        const response = await axios.post(
          "http://localhost:3000/api/jira/createIssue",
          {
            projectKey,
            title,
            description,
            acceptance_criteria: acceptance,
            priority,
            labels: labelsArray,
            due_date: dueDate,
            start_date: startDate,
            story_point_estimate: storyPointEstimate,
          }
        );
        const historyResponse = await axios.get(
          `http://localhost:3000/api/jira/history/${projectKey}`
        );
        setHistory(historyResponse.data);
        setError(null);
        setJiraSuccess({ id: response.data.issueId, url: response.data.issueUrl });
      } else {
        // Old behavior for other tabs
        const content =
          tab === "Automation Scripts" && typeof editedResults[tab] === "object"
            ? editedResults[tab][selectedScriptLanguage] || ""
            : editedResults[tab] || "";
        if (!content) {
          setError("No content to push to Jira.");
          return;
        }
        let title = `${tab} for ${projectKey}`;
        if (tab === "User Stories & Acceptance Criteria") {
          const match = content.match(/Title:\s*(.+?)(?:\n|$)/);
          if (match && match[1]) {
            title = match[1].substring(0, 100);
          } else {
            title = content.split("\n")[0].substring(0, 100);
          }
        }
        const response = await axios.post(
          "http://localhost:3000/api/jira/issue",
          {
            projectKey,
            type: tab,
            title,
            content,
          }
        );
        const historyResponse = await axios.get(
          `http://localhost:3000/api/jira/history/${projectKey}`
        );
        setHistory(historyResponse.data);
        setError(null);
        setJiraSuccess({ id: response.data.issueId });
      }
    } catch (error) {
      let errorMessage =
        error.response?.data?.error?.errors?.issuetype ||
        error.response?.data?.error?.errorMessages?.[0] ||
        error.response?.data?.error ||
        error.message ||
        "Failed to push to Jira. Please try again.";
      if (typeof errorMessage === "object") {
        errorMessage = JSON.stringify(errorMessage);
      }
      setError(errorMessage);
      setJiraSuccess(null);
    }
  };

  useEffect(() => {
    saveDraft();
  }, [generationResults["User Stories & Acceptance Criteria"], projectKey]);

  // Fetch history
  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/jira/history/${projectKey}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error.message);
        setError("Failed to fetch generation history.");
      }
    }
    fetchHistory();
  }, [projectKey]);

  // Save generated content to cache when it changes (but NOT on projectKey change)
  useEffect(() => {
    if (projectKey) {
      if (!projectContentCache[projectKey]) projectContentCache[projectKey] = {};
      if (generationResults["User Stories & Acceptance Criteria"]) {
        projectContentCache[projectKey].userStory = JSON.stringify(generationResults["User Stories & Acceptance Criteria"]);
      }
      if (generationResults["Test Cases"]) {
        projectContentCache[projectKey].testCases = JSON.stringify(generationResults["Test Cases"]);
      }
      if (generationResults["Automation Scripts"]) {
        projectContentCache[projectKey].automation = JSON.stringify(generationResults["Automation Scripts"]);
      }
    }
  }, [
    generationResults["User Stories & Acceptance Criteria"],
    generationResults["Test Cases"],
    generationResults["Automation Scripts"]
    // DO NOT include projectKey here!
  ]);

  // Restore or clear all sections on project change
  useEffect(() => {
    setTitle("");
    setDescription("");
    setAcceptance("");
    setGenerationResults({
      ["User Stories & Acceptance Criteria"]: undefined,
      ["Test Cases"]: undefined,
      ["Automation Scripts"]: undefined,
    });

    if (projectKey && projectContentCache[projectKey]) {
      // User Stories
      if (projectContentCache[projectKey].userStory) {
        const parsed = JSON.parse(projectContentCache[projectKey].userStory);
        setTitle(parsed.title || "");
        setDescription(parsed.description || "");
        setAcceptance(parsed.acceptance_criteria || "");
        setAssignee(parsed.assignee || "");
        setPriority(parsed.priority || "");
        setParent(parsed.parent || "");
        setDueDate(parsed.due_date || "");
        setLabels(parsed.labels || "");
        setTeam(parsed.team || "");
        setStartDate(parsed.start_date || "");
        setSprint(parsed.sprint || "");
        setStoryPointEstimate(parsed.story_point_estimate || "");
        setDevelopement(parsed.developement || "");
        setReports(parsed.reports || "");
      }
      setGenerationResults({
        ["User Stories & Acceptance Criteria"]: projectContentCache[projectKey].userStory
          ? JSON.parse(projectContentCache[projectKey].userStory)
          : undefined,
        ["Test Cases"]: projectContentCache[projectKey].testCases
          ? JSON.parse(projectContentCache[projectKey].testCases)
          : undefined,
        ["Automation Scripts"]: projectContentCache[projectKey].automation
          ? JSON.parse(projectContentCache[projectKey].automation)
          : undefined,
      });
    }
  }, [projectKey]);

  const handleEditResult = (tab, value) => {
    setEditedResults((prev) => ({ ...prev, [tab]: value }));
  };

  const handleCopy = async (tab) => {
    try {
      const content =
        tab === "Automation Scripts" && typeof editedResults[tab] === "object"
          ? editedResults[tab][selectedScriptLanguage] || ""
          : editedResults[tab] || "";
      await navigator.clipboard.writeText(content);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 1500);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  // When entering edit mode, combine fields into one string with extra space between each
  const handleEditToggle = (tab) => {
    setEditMode((prev) => {
      const isEditing = prev[tab];
      if (!isEditing && tab === "User Stories & Acceptance Criteria") {
        setUserStoryText(
          `Title: ${title}\n\n` +
          `Assignee: ${assignee}\n\n` +
          `Priority: ${priority}\n\n` +
          `Parent: ${parent}\n\n` +
          `Due Date: ${dueDate}\n\n` +
          `Labels: ${labels}\n\n` +
          `Team: ${team}\n\n` +
          `Start Date: ${startDate}\n\n` +
          `Sprint: ${sprint}\n\n` +
          `Story Point Estimate: ${storyPointEstimate}\n\n` +
          `Development: ${developement}\n\n` +
          `Reports: ${reports}\n\n` +
          `Description: ${description}\n\n` +
          `Acceptance Criteria: ${acceptance}`
        );
      }
      if (isEditing) {
        setJustSaved((prevSaved) => ({ ...prevSaved, [tab]: true }));
        setTimeout(() => {
          setJustSaved((prevSaved) => ({ ...prevSaved, [tab]: false }));
        }, 2000);
      }
      return { ...prev, [tab]: !isEditing };
    });
  };

  // When saving, parse the textarea content back into fields
  const handleSaveUserStory = () => {
    // Use regex to extract each section (allow for extra blank lines)
    const titleMatch = userStoryText.match(/Title:\s*([\s\S]*?)\n\nAssignee:/);
    const assigneeMatch = userStoryText.match(/Assignee:\s*([\s\S]*?)\n\nPriority:/);
    const priorityMatch = userStoryText.match(/Priority:\s*([\s\S]*?)\n\nParent:/);
    const parentMatch = userStoryText.match(/Parent:\s*([\s\S]*?)\n\nDue Date:/);
    const dueDateMatch = userStoryText.match(/Due Date:\s*([\s\S]*?)\n\nLabels:/);
    const labelsMatch = userStoryText.match(/Labels:\s*([\s\S]*?)\n\nTeam:/);
    const teamMatch = userStoryText.match(/Team:\s*([\s\S]*?)\n\nStart Date:/);
    const startDateMatch = userStoryText.match(/Start Date:\s*([\s\S]*?)\n\nSprint:/);
    const sprintMatch = userStoryText.match(/Sprint:\s*([\s\S]*?)\n\nStory Point Estimate:/);
    const storyPointEstimateMatch = userStoryText.match(/Story Point Estimate:\s*([\s\S]*?)\n\nDevelopment:/);
    const developementMatch = userStoryText.match(/Development:\s*([\s\S]*?)\n\nReports:/);
    const reportsMatch = userStoryText.match(/Reports:\s*([\s\S]*?)\n\nDescription:/);
    const descriptionMatch = userStoryText.match(/Description:\s*([\s\S]*?)\n\nAcceptance Criteria:/);
    const acceptanceMatch = userStoryText.match(/Acceptance Criteria:\s*([\s\S]*)/);
    setTitle(titleMatch ? titleMatch[1].trim() : "");
    setAssignee(assigneeMatch ? assigneeMatch[1].trim() : "");
    setPriority(priorityMatch ? priorityMatch[1].trim() : "");
    setParent(parentMatch ? parentMatch[1].trim() : "");
    setDueDate(dueDateMatch ? dueDateMatch[1].trim() : "");
    setLabels(labelsMatch ? labelsMatch[1].trim() : "");
    setTeam(teamMatch ? teamMatch[1].trim() : "");
    setStartDate(startDateMatch ? startDateMatch[1].trim() : "");
    setSprint(sprintMatch ? sprintMatch[1].trim() : "");
    setStoryPointEstimate(storyPointEstimateMatch ? storyPointEstimateMatch[1].trim() : "");
    setDevelopement(developementMatch ? developementMatch[1].trim() : "");
    setReports(reportsMatch ? reportsMatch[1].trim() : "");
    setDescription(descriptionMatch ? descriptionMatch[1].trim() : "");
    setAcceptance(acceptanceMatch ? acceptanceMatch[1].trim() : "");
    setEditMode((prev) => ({ ...prev, ["User Stories & Acceptance Criteria"]: false }));
  };

  const handleGenerateTest = async () => {
    setIsGeneratingAll(true);
    setGenerationResults({}); // Clear previous results
    setEditedResults({}); // Clear previous edits
    setError(null);
    setActiveGenerationTab("User Stories & Acceptance Criteria");
    
    const filesContent = uploadedFiles.map((f) => f.content).join("\n");
    const requirement = (filesContent ? filesContent + "\n" : "") + prompt;
    console.log("Prompt being sent:", prompt);
  
    // First validate the prompt
    try {
      const validationResponse = await axios.post(
        "http://localhost:8000/generate_contents",
        { requirement }
      );
  
      // If the response has an error, stop generation
      if (validationResponse.data.error) {
        setError(validationResponse.data.error);
        setGenerationResults({});
        setEditedResults({});
        setGenerationErrors({});
        setIsGeneratingAll(false);
        return;
      }
    } catch (error) {
      // Handle validation error
      setError("Failed to validate prompt. Please try again.");
      setGenerationResults({});
      setEditedResults({});
      setGenerationErrors({});
      setIsGeneratingAll(false);
      return;
    }
  
    // Only proceed with generation if prompt validation passed
    const endpoints = {
      "User Stories & Acceptance Criteria": {
        endpoint: "/jira_user_story",
        payload: { requirement },
      },
      "Test Cases": {
        endpoint: "/test_cases",
        payload: { requirement },
      },
      "Automation Scripts": {
        endpoint: "/automation_script",
        payload: { requirement, languages: scriptLanguages },
      },
    };
  
    setGenerationLoading({
      "User Stories & Acceptance Criteria": true,
      "Test Cases": true,
      "Automation Scripts": true,
    });
    setGenerationErrors({});
  
    await Promise.all(
      Object.entries(endpoints).map(async ([tab, { endpoint, payload }]) => {
        try {
          const res = await axios.post(
            `http://localhost:8000${endpoint}`,
            payload
          );
          if (tab === "Automation Scripts") {
            setGenerationResults((prev) => ({
              ...prev,
              [tab]: res.data.result,
            }));
            setSelectedScriptLanguage("Python");
            setEditedResults((prev) => ({ ...prev, [tab]: res.data.result }));
          } else if (tab === "User Stories & Acceptance Criteria") {
            setTitle(res.data.title || "");
            setDescription(res.data.description || "");
            setAcceptance(res.data.acceptance_criteria || "");
            setAssignee(res.data.assignee || "");
            setPriority(res.data.priority || "");
            setParent(res.data.parent || "");
            setDueDate(res.data.due_date || "");
            setLabels(res.data.labels || "");
            setTeam(res.data.team || "");
            setStartDate(res.data.start_date || "");
            setSprint(res.data.sprint || "");
            setStoryPointEstimate(res.data.story_point_estimate || "");
            setDevelopement(res.data.developement || "");
            setReports(res.data.reports || "");
            setGenerationResults((prev) => ({
              ...prev,
              [tab]: res.data,
            }));
            setEditedResults((prev) => ({ ...prev, [tab]: res.data }));
          } else {
            setGenerationResults((prev) => ({
              ...prev,
              [tab]: res.data.result,
            }));
            setEditedResults((prev) => ({ ...prev, [tab]: res.data.result }));
          }
          setGenerationErrors((prev) => ({ ...prev, [tab]: undefined }));
        } catch (err) {
          let backendError =
            err.response?.data?.error ||
            err.response?.data?.detail ||
            err.message ||
            "Failed to generate result. Please try again.";
          setGenerationErrors((prev) => ({
            ...prev,
            [tab]: backendError,
          }));
        } finally {
          setGenerationLoading((prev) => ({ ...prev, [tab]: false }));
        }
      })
    );
    setIsGeneratingAll(false);
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

  const isAnyGenerationLoading = Object.values(generationLoading).some(Boolean);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const allowedTypes = [
      "text/plain",
      "text/markdown",
      "text/x-markdown",
      "application/octet-stream",
    ];
    let errorSet = false;
    files.forEach((file) => {
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.endsWith(".md") &&
        !file.name.endsWith(".txt")
      ) {
        setError("Unsupported file type. Please upload a .txt or .md file.");
        errorSet = true;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles((prev) => {
          if (prev.some((f) => f.name === file.name)) return prev;
          return [...prev, { name: file.name, content: event.target.result }];
        });
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        errorSet = true;
      };
      reader.readAsText(file);
    });
    if (!errorSet) setError(null);
  };

  const handleRemoveFile = (name) =>
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  };

  function renderBoldMarkdown(text) {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  return (
    <ErrorBoundary>
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
                  <span className="text-red-600 font-medium">
                    New Generation
                  </span>
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
                        onChange={(e) => {
                          setSelectedProject(e.target.value);
                          const selected = projects.find(
                            (p) => p.name === e.target.value
                          );
                          if (selected) {
                            navigate("/requirements", {
                              state: { projectKey: selected.key },
                            });
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 font-medium cursor-pointer rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {projects.map((project) => (
                          <option key={project.key} value={project.name}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <Link
                      to="/history"
                      state={{ projectKey }}
                      className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      History
                    </Link>
                  </div>
                </div>

                {/* Content Layout */}
                <div className="space-y-6">
                  {(error || jiraSuccess) && (
                    <div className={
                      error
                        ? "bg-red-100 text-red-700 p-4 rounded-lg"
                        : "bg-green-100 text-green-700 p-4 rounded-lg"
                    }>
                      {error
                        ? (typeof error === "object" ? JSON.stringify(error) : error)
                        : (
                          <span>
                            Pushed to Jira: <a href={jiraSuccess.url} target="_blank" rel="noopener noreferrer" className="underline font-bold">{jiraSuccess.id}</a>
                          </span>
                        )}
                    </div>
                  )}

                  {/* Uploaded file chips above input */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-2 flex flex-wrap items-center gap-2 max-w-full">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1 relative group max-w-xs overflow-hidden"
                        >
                          <AiOutlineFile className="w-4 h-4 text-gray-500 mr-1" />
                          <span
                            className="truncate text-sm text-gray-800"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                          <button
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveFile(file.name)}
                            type="button"
                            aria-label="Remove file"
                          >
                            <AiOutlineClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
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
                          multiple
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
                      disabled={isAnyGenerationLoading || isGeneratingAll}
                      style={
                        isAnyGenerationLoading || isGeneratingAll
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
                      <nav className="flex space-x-8 px-6 items-center">
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
                        {activeGenerationTab === "Automation Scripts" && (
                          <select
                            value={selectedScriptLanguage}
                            onChange={(e) =>
                              setSelectedScriptLanguage(e.target.value)
                            }
                            className="-ml-4 px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 hover:border-blue-400 cursor-pointer"
                            style={{ minWidth: 110 }}
                          >
                            {scriptLanguages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        )}
                      </nav>
                    </div>
                    <div className="p-6">
                      <div className="min-h-[400px]">
                        {isGeneratingAll ? (
                          <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                            Generating results, please wait...
                          </div>
                        ) : generationLoading[activeGenerationTab] ? (
                          <div className="flex items-center justify-center h-40 text-gray-500">
                            Generating...
                          </div>
                        ) : generationErrors[activeGenerationTab] ? (
                          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                            {generationErrors[activeGenerationTab]}
                          </div>
                        ) : activeGenerationTab === "User Stories & Acceptance Criteria" && generationResults[activeGenerationTab] ? (
                          <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                              {editMode[activeGenerationTab] ? (
                                <textarea
                                  className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 bg-white resize-none"
                                  value={userStoryText}
                                  onChange={e => setUserStoryText(e.target.value)}
                                  style={{ backgroundColor: "#fff", minHeight: "24rem" }}
                                />
                              ) : (
                                <div className="space-y-4">
                                  <div><strong>Title</strong><br /><span style={{ whiteSpace: 'pre-line' }}>{title}</span></div>
                                  <div><strong>Assignee:</strong> <span style={{ whiteSpace: 'pre-line' }}>{assignee}</span></div>
                                  <div><strong>Priority:</strong> <span style={{ whiteSpace: 'pre-line' }}>{priority}</span></div>
                                  <div><strong>Parent:</strong> <span style={{ whiteSpace: 'pre-line' }}>{parent}</span></div>
                                  <div><strong>Due Date:</strong> <span style={{ whiteSpace: 'pre-line' }}>{dueDate}</span></div>
                                  <div><strong>Labels:</strong> <span style={{ whiteSpace: 'pre-line' }}>{labels}</span></div>
                                  <div><strong>Team:</strong> <span style={{ whiteSpace: 'pre-line' }}>{team}</span></div>
                                  <div><strong>Start Date:</strong> <span style={{ whiteSpace: 'pre-line' }}>{startDate}</span></div>
                                  <div><strong>Sprint:</strong> <span style={{ whiteSpace: 'pre-line' }}>{sprint}</span></div>
                                  <div><strong>Story Point Estimate:</strong> <span style={{ whiteSpace: 'pre-line' }}>{storyPointEstimate}</span></div>
                                  <div><strong>Development:</strong> <span style={{ whiteSpace: 'pre-line' }}>{developement}</span></div>
                                  <div><strong>Reports:</strong> <span style={{ whiteSpace: 'pre-line' }}>{reports}</span></div>
                                  <div><strong>Description</strong><br /><span style={{ whiteSpace: 'pre-line' }}>{description}</span></div>
                                  <div><strong>Acceptance criteria</strong><br /><span style={{ whiteSpace: 'pre-line' }}>{acceptance}</span></div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 justify-start">
                              <button
                                className="px-4 py-2 bg-[#0089EB] cursor-pointer text-white rounded-lg hover:bg-[#007acc] text-sm font-medium"
                                onClick={() => handlePushToJira(activeGenerationTab)}
                                type="button"
                              >
                                Push to Jira
                              </button>
                              <button
                                className="text-sm font-medium flex cursor-pointer items-center pl-8 gap-x-1 transition-transform duration-150"
                                onClick={() =>
                                  editMode[activeGenerationTab]
                                    ? handleSaveUserStory()
                                    : handleEditToggle(activeGenerationTab)
                                }
                                type="button"
                              >
                                {editMode[activeGenerationTab] ? (
                                  <IoSaveOutline className="w-4 h-4" />
                                ) : (
                                  <CiEdit className="w-4 h-4" />
                                )}
                                {editMode[activeGenerationTab] ? "Save" : "Edit"}
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
                                  className={`transition-all duration-300 ${copiedTab === activeGenerationTab ? "text-green-600" : ""}`}
                                >
                                  {copiedTab === activeGenerationTab ? "Copied" : "Copy"}
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : activeGenerationTab === "Test Cases" && generationResults["Test Cases"] ? (
                          <div className="flex gap-4 mb-2">
                            <div className="flex-1">
                              <div className="w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 overflow-auto whitespace-pre-wrap" style={{ minHeight: "24rem" }}>
                                {generationResults["Test Cases"]}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-start">
                              <button
                                className="text-sm font-medium flex items-center cursor-pointer pl-8 gap-x-1 transition-all duration-300 ease-in-out"
                                onClick={() => handleCopy("Test Cases")}
                                type="button"
                              >
                                {copiedTab === "Test Cases" ? (
                                  <TiTick className="w-4 h-4 text-green-600" />
                                ) : (
                                  <MdContentCopy className="w-4 h-4" />
                                )}
                                <span className={`transition-all duration-300 ${copiedTab === "Test Cases" ? "text-green-600" : ""}`}>
                                  {copiedTab === "Test Cases" ? "Copied" : "Copy"}
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : activeGenerationTab === "Automation Scripts" && generationResults["Automation Scripts"] ? (
                          <div className="relative w-full h-96 border border-gray-300 rounded-lg p-4 text-gray-700 overflow-auto whitespace-pre-wrap" style={{ minHeight: "24rem" }}>
                            <button
                              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 hover:text-blue-600 hover:bg-gray-200 text-xs font-medium transition-all"
                              onClick={async () => {
                                const script =
                                  generationResults["Automation Scripts"] &&
                                  typeof generationResults["Automation Scripts"] === "object"
                                    ? generationResults["Automation Scripts"][selectedScriptLanguage] || ""
                                    : "";
                                if (script) {
                                  await navigator.clipboard.writeText(script);
                                  setCopiedTab("Automation Scripts");
                                  setTimeout(() => setCopiedTab(null), 1500);
                                }
                              }}
                              type="button"
                              aria-label="Copy script"
                            >
                              {copiedTab === "Automation Scripts" ? (
                                <>
                                  <TiTick className="w-4 h-4 text-green-600" /> Copied!
                                </>
                              ) : (
                                <>
                                  <MdContentCopy className="w-4 h-4" /> Copy
                                </>
                              )}
                            </button>
                            {generationResults["Automation Scripts"] &&
                            typeof generationResults["Automation Scripts"] === "object"
                              ? generationResults["Automation Scripts"][selectedScriptLanguage] || "No script generated for this language."
                              : "No automation scripts generated yet. Click 'Generate test' to create scripts."}
                          </div>
                        ) : (
                          <div className="min-h-[400px] flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <GrDocumentTest className="w-8 h-8" />
                              </div>
                              <p className="text-sm">
                                Generate {activeGenerationTab.toLowerCase()} by
                                entering a story ID above
                              </p>
                            </div>
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
      {showJiraConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-lg font-semibold mb-4">Are you sure you want to push to Jira?</div>
            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
                onClick={() => setShowJiraConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#0089EB] text-white rounded hover:bg-blue-700 font-medium"
                onClick={() => handleConfirmPushToJira(activeGenerationTab)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
