// import { useNavigate } from "react-router-dom";
// import card1 from "../assets/heartbeat.png";
// import card2 from "../assets/shopping-cart.png";
// import card3 from "../assets/health-insurance.png";
// import card4 from "../assets/supply-chain.png";

// const cardImages = [card1, card2, card3, card4];

// export default function ProjectCard({ project }) {
//   const navigate = useNavigate();
//   const icon =
//     project.icon || cardImages[Math.floor(Math.random() * cardImages.length)];

//   const handleViewClick = () => {
//     if (!project.projectKey) {
//       console.error("Project key is missing for project:", project);
//       return;
//     }
//     console.log("Navigating with projectKey:", project.projectKey); // ✅ Correct key
//     navigate("/dashboard", { state: { projectKey: project.projectKey } });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
//         <img
//           src={project.icon}
//           alt={`${project.name} icon`}
//           className="w-10 h-10 lg:w-12 lg:h-12"
//         />
//       </div>
//       <p className="text-sm text-[#1C1B1FCC] font-medium mb-4">
//         Jira: {project.projectKey}
//       </p>
//       <div className="flex text-sm font-medium text-gray-700 mb-6 space-x-3">
//         <div className="flex items-center">
//           <span className="font-semibold text-[#1C1B1FCC] mr-1">Stories:</span>
//           <span>{project.stories}</span>
//         </div>
//         <span className="text-gray-400">|</span>
//         <div className="flex items-center">
//           <span className="font-semibold text-[#1C1B1FCC] mr-1">Tests:</span>
//           <span>{project.tests}</span>
//         </div>
//         <span className="text-gray-400">|</span>
//         <div className="flex items-center">
//           <span className="font-semibold text-[#1C1B1FCC] mr-1">Scripts:</span>
//           <span>{project.scripts}</span>
//         </div>
//       </div>
//       <button
//         onClick={handleViewClick}
//         className="bg-[#0089EB] hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
//       >
//         View
//       </button>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import card1 from "../assets/heartbeat.png";
import card2 from "../assets/shopping-cart.png";
import card3 from "../assets/health-insurance.png";
import card4 from "../assets/supply-chain.png";

const cardImages = [card1, card2, card3, card4];

// Project card component for displaying project details
export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const handleViewClick = () => {
    if (!project.projectKey) {
      console.error("Project key is missing for project:", project);
      // TODO: Add user-facing notification (e.g., toast) for missing project key
      return;
    }
    console.log("Navigating with projectKey:", project.projectKey);
    navigate("/dashboard", { state: { projectKey: project.projectKey } });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
        <img
          src={project.icon || cardImages[0]} // Fallback to first image if icon is missing
          alt={`${project.name} icon`}
          className="w-10 h-10 lg:w-12 lg:h-12"
        />
      </div>
      <p className="text-sm text-[#1C1B1FCC] font-medium mb-4">
        Jira: {project.projectKey}
      </p>
      <div className="flex text-sm font-medium text-gray-700 mb-6 space-x-3">
        <div className="flex items-center">
          <span className="font-semibold text-[#1C1B1FCC] mr-1">Stories:</span>
          <span>{project.stories}</span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="flex items-center">
          <span className="font-semibold text-[#1C1B1FCC] mr-1">Tests:</span>
          <span>{project.tests}</span>
        </div>
        <span className="text-gray-400">|</span>
        <div className="flex items-center">
          <span className="font-semibold text-[#1C1B1FCC] mr-1">Scripts:</span>
          <span>{project.scripts}</span>
        </div>
      </div>
      <button
        onClick={handleViewClick}
        className="bg-[#0089EB] hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
      >
        View
      </button>
    </div>
  );
}
