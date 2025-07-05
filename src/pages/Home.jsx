// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Bot, Plus, Eye } from "lucide-react";
// import { RiHome2Line } from "react-icons/ri";
// import { MdBackupTable, MdInsights, MdOutlineVerified } from "react-icons/md";
// import { TbReportAnalytics } from "react-icons/tb";
// import { CiSettings } from "react-icons/ci";
// import welcomeImg from "../assets/welcome-img.png";
// import card1 from "../assets/heartbeat.png";
// import card2 from "../assets/shopping-cart.png";
// import card3 from "../assets/health-insurance.png";
// import card4 from "../assets/supply-chain.png";
// import {
//   getAllProjects,
//   getProjectInfo,
//   getProjectStories,
// } from "../utils/jiraApi";
// import LoadingSpinner from "../components/LoadingSpinner";
// import ProjectCard from "../components/Projects";

// export default function Home() {
//   const [activeTab, setActiveTab] = useState("Home");
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const cardImages = [card1, card2, card3, card4];
//   const sidebarItems = [
//     { name: "Home", icon: RiHome2Line, active: true },
//     { name: "Generative Agent", icon: MdBackupTable, active: false },
//     { name: "Executions", icon: MdOutlineVerified, active: false },
//     { name: "Integrations", icon: MdInsights, active: false },
//     { name: "Reports", icon: TbReportAnalytics, active: false },
//     { name: "Settings", icon: CiSettings, active: false },
//   ];

//   useEffect(() => {
//     async function fetchProjects() {
//       try {
//         const allProjects = await getAllProjects();
//         console.log("Projects:", allProjects); // Debug the data
//         const projectData = await Promise.all(
//           allProjects.map(async (project, index) => {
//             const storiesData = await getProjectStories(project.key);
//             return {
//               name: project.name,
//               projectKey: project.key,
//               id: project.id,
//               stories: storiesData.total || 0,
//               tests: storiesData.tests || 0,
//               scripts: storiesData.scripts || 0,
//               icon: cardImages[index % cardImages.length], // Assign icon deterministically
//             };
//           })
//         );

//         setProjects(projectData);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching projects:", error.message);
//         setError("Failed to fetch projects.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProjects();
//   }, []);

//   return loading ? (
//     <LoadingSpinner fullPage />
//   ) : (
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
//         {/* Sidebar */}
//         <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
//           <nav className="flex-1 p-4 space-y-2">
//             {sidebarItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => setActiveTab(item.name)}
//                 className={`w-full flex items-center cursor-pointer px-3 py-2 text-left rounded-lg transition-colors ${
//                   item.name === activeTab
//                     ? "bg-red-50 font-medium text-red-600 border-l-4 border-red-600"
//                     : "font-medium hover:bg-gray-100"
//                 }`}
//               >
//                 <item.icon className="w-5 h-5 mr-3" />
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <main className="flex-1 overflow-y-auto">
//             <div className="p-6">
//               <h2 className="text-sm font-medium text-red-600 mb-4">Home</h2>

//               {error && (
//                 <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//                   {error}
//                 </div>
//               )}

//               <div className="bg-white rounded-2xl shadow p-6 mb-8 relative overflow-visible">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                   <div>
//                     <h1 className="custom-heading mb-2">
//                       Welcome to{" "}
//                       <span className="testomate-brand text-red-600">
//                         Testomate
//                       </span>
//                     </h1>
//                     <h2 className="text-xl font-semibold text-[#343434] mb-4">
//                       AI-Driven Testing & Requirement Automation
//                     </h2>
//                     <p className="text-[#6C727F] max-w-lg">
//                       Generate intelligent requirements, detailed user stories,
//                       test scenarios, and executable scripts using Agentic AI —
//                       all in one place.
//                     </p>
//                   </div>
//                   <div className="relative -mt-10 lg:-mt-12">
//                     <img
//                       src={welcomeImg}
//                       alt="Welcome"
//                       className="w-56 lg:w-72 mx-auto"
//                       style={{ objectFit: "contain" }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-8">
//                 <button className="bg-[#EB1700] cursor-pointer hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
//                   New Project +
//                 </button>
//               </div>

//               {loading ? (
//                 <LoadingSpinner />
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {projects.map((project) => (
//                     <ProjectCard key={project.id} project={project} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Plus, Eye } from "lucide-react";
import { RiHome2Line } from "react-icons/ri";
import { MdBackupTable, MdInsights, MdOutlineVerified } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import welcomeImg from "../assets/welcome-img.png";
import { getAllProjects, getProjectStories } from "../utils/jiraApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ProjectCard from "../components/Projects";
import { cardImages } from "../utils/constants"; // New constants file
import Header from "../components/Header";

// In-memory cache for project data
const projectCache = new Map();

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
          projectCache.set("projects", allProjects);
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
            : "Failed to fetch projects from Jira."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return loading ? (
    <LoadingSpinner fullPage />
  ) : (
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
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
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
                <button className="bg-[#EB1700] cursor-pointer hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
                  New Project +
                </button>
              </div>

              {loading ? (
                <LoadingSpinner />
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
