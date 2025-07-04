import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Plus, Eye } from "lucide-react";
import { RiHome2Line } from "react-icons/ri";
import { MdBackupTable, MdInsights, MdOutlineVerified } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import welcomeImg from "../assets/welcome-img.png";
import card1 from "../assets/heartbeat.png";
import card2 from "../assets/shopping-cart.png";
import card3 from "../assets/health-insurance.png";
import card4 from "../assets/supply-chain.png";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Home", icon: RiHome2Line, active: true },
    { name: "Generative Agent", icon: MdBackupTable, active: false },
    { name: "Executions", icon: MdOutlineVerified, active: false },
    { name: "Integrations", icon: MdInsights, active: false },
    { name: "Reports", icon: TbReportAnalytics, active: false },
    { name: "Settings", icon: CiSettings, active: false },
  ];

  const projects = [
    {
      name: "RSC",
      jira: "RSC44565",
      stories: 42,
      tests: 135,
      scripts: 87,
      icon: card1, // ✅ directly use the image
    },
    {
      name: "GCA Approval Portal",
      jira: "GCA156324",
      stories: 28,
      tests: 98,
      scripts: 55,
      icon: card2,
    },
    {
      name: "CAR-T",
      jira: "CT123654",
      stories: 35,
      tests: 110,
      scripts: 60,
      icon: card3,
    },
    {
      name: "EoV",
      jira: "EOV15364",
      stories: 30,
      tests: 78,
      scripts: 52,
      icon: card4,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo on the left */}
          <h1 className="text-xl font-bold text-gray-900">Testomate</h1>

          {/* Profile on the right */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          {/* Navigation */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-sm font-medium text-red-600 mb-4">Home</h2>

              {/* Welcome Section */}
              <div className="bg-white rounded-2xl shadow p-6 mb-8 relative overflow-visible">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Text Content */}
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

                  {/* Image */}
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

              {/* New Project Button */}
              <div className="mb-8">
                <button className="bg-[#EB1700] cursor-pointer hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center">
                  New Project +
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Top Row: Project Name (left) and Icon (right) */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {project.name}
                      </h3>
                      <img
                        src={project.icon}
                        alt={`${project.name} icon`}
                        className="w-10 h-10 lg:w-12 lg:h-12"
                      />
                    </div>

                    {/* Jira ID below project name */}
                    <p className="text-sm text-[#1C1B1FCC] font-medium mb-4">
                      Jira: {project.jira}
                    </p>

                    {/* Stats row with separators */}
                    <div className="flex text-sm font-medium text-gray-700 mb-6 space-x-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-[#1C1B1FCC] mr-1">
                          Stories:
                        </span>
                        <span>{project.stories}</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-[#1C1B1FCC] mr-1">
                          Tests:
                        </span>
                        <span>{project.tests}</span>
                      </div>
                      <span className="text-gray-400">|</span>
                      <div className="flex items-center">
                        <span className="font-semibold text-[#1C1B1FCC] mr-1">
                          Scripts:
                        </span>
                        <span>{project.scripts}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => {
                        if (project.name === "RSC") {
                          navigate("/dashboard");
                        } else {
                          alert("This project doesn't have a dashboard yet.");
                        }
                      }}
                      className="bg-[#0089EB] hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
