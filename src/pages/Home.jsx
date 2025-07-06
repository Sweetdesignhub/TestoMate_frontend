import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Plus, Eye } from "lucide-react";
import { RiHome2Line } from "react-icons/ri";
import { MdBackupTable, MdInsights, MdOutlineVerified } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import {
  getAllProjects,
  getProjectStories,
  createJiraProject,
  getProjectInfo,
} from "../utils/jiraApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ProjectCard from "../components/Projects";
import { cardImages } from "../utils/constants";
import Header from "../components/Header";
import { IoMdClose, IoMdInformationCircleOutline } from "react-icons/io";
import { BiError } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import welcomeImg from "../assets/welcome-img.png";
import NewProjectModal from "../components/NewProjectModal";

// In-memory cache for project data
const projectCache = new Map();

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    key: "",
    description: "",
  });
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Home", icon: RiHome2Line },
    { name: "Generative Agent", icon: MdBackupTable },
    { name: "Executions", icon: MdOutlineVerified },
    { name: "Integrations", icon: MdInsights },
    { name: "Reports", icon: TbReportAnalytics },
    { name: "Settings", icon: CiSettings },
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        let allProjects = projectCache.get("projects");
        if (!allProjects) {
          allProjects = await getAllProjects();
          projectCache.set("projects", allProjects || []);
        }
        console.log("Projects:", allProjects);

        const projectData = await Promise.all(
          allProjects.map(async (project, index) => {
            let storiesData = projectCache.get(`stories-${project.key}`);
            if (!storiesData) {
              storiesData = await getProjectStories(project.key);
              projectCache.set(`stories-${project.key}`, storiesData);
            }
            return {
              name: project.name,
              projectKey: project.key,
              id: project.id,
              stories: storiesData.total || 0,
              tests: storiesData.tests || 0,
              scripts: storiesData.scripts || 0,
              icon: cardImages[index % cardImages.length],
            };
          })
        );

        setProjects(projectData);
        setError(null);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        setError(
          error.response?.status === 401
            ? "Unauthorized: Invalid Jira credentials."
            : "Failed to fetch projects from Jira. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.key) {
      setError("Project name and key are required.");
      return;
    }

    // Validate project key format (uppercase letters, 2-10 characters)
    const keyRegex = /^[A-Z0-9]{2,10}$/;
    if (!keyRegex.test(newProject.key.toUpperCase())) {
      setError("Project key must be 2-10 uppercase letters.");
      return;
    }

    try {
      setLoading(true);
      const newJiraProject = await createJiraProject({
        name: newProject.name,
        key: newProject.key.toUpperCase(),
        description: newProject.description,
      });

      // 💡 Fetch full project info (like real name, description, etc.)
      const fullProjectInfo = await getProjectInfo(newJiraProject.key);
      const storiesData = await getProjectStories(fullProjectInfo.key);

      const newProjectData = {
        name: fullProjectInfo.name,
        projectKey: fullProjectInfo.key,
        id: fullProjectInfo.id,
        stories: storiesData.total || 0,
        tests: storiesData.tests || 0,
        scripts: storiesData.scripts || 0,
        icon: cardImages[projects.length % cardImages.length],
      };

      const currentProjects = projectCache.get("projects") || [];
      projectCache.set("projects", [...currentProjects, fullProjectInfo]);
      setProjects([...projects, newProjectData]);

      setShowModal(false);
      setNewProject({ name: "", key: "", description: "" });
      setError(null);
    } catch (error) {
      console.error("Error creating project:", error.message);
      setError(
        error.response?.status === 401
          ? "Unauthorized: Invalid Jira credentials."
          : error.response?.status === 400
          ? error.response?.data?.errorMessages?.join(" ") ||
            error.response?.data?.errors?.projectLead ||
            "Invalid project key or name. Key must be unique and 2-10 uppercase letters."
          : "Failed to create project in Jira. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center cursor-pointer px-3 py-2 text-left rounded-lg transition-colors ${
                  item.name === activeTab
                    ? "bg-red-50 font-medium text-red-600 border-l-4 border-red-600"
                    : "font-medium hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-sm font-medium text-red-600 mb-4">Home</h2>

              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center">
                  <BiError className="w-6 h-6 mr-2" />
                  {error}
                </div>
              )}

              <div className="bg-white rounded-2xl shadow p-6 mb-8 relative overflow-visible">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h1 className="custom-heading mb-2">
                      Welcome to{" "}
                      <span className="testomate-brand text-red-600">
                        Testomate
                      </span>
                    </h1>
                    <h2 className="text-xl font-semibold text-[#343434] mb-4">
                      AI-Driven Testing & Requirement Automation
                    </h2>
                    <p className="text-[#6C727F] max-w-lg">
                      Generate intelligent requirements, detailed user stories,
                      test scenarios, and executable scripts using Agentic AI —
                      all in one place.
                    </p>
                  </div>
                  <div className="relative -mt-10 lg:-mt-12">
                    <img
                      src={welcomeImg}
                      alt="Welcome"
                      className="w-56 lg:w-72 mx-auto"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#EB1700] cursor-pointer hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  New Project +
                </button>
              </div>

              {/* Modal for creating new project */}
              <NewProjectModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateProject}
                loading={loading}
                error={error}
                newProject={newProject}
                onChange={handleInputChange}
              />

              {loading ? (
                <LoadingSpinner fullPage />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
