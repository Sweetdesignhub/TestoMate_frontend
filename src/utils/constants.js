import card1 from "../assets/heartbeat.png";
import card2 from "../assets/shopping-cart.png";
import card3 from "../assets/health-insurance.png";
import card4 from "../assets/supply-chain.png";
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
import { AiTwotoneExperiment } from "react-icons/ai";
import { LuCircleFadingArrowUp } from "react-icons/lu";

export const cardImages = [card1, card2, card3, card4];

export const mainSidebarItems = [
  { name: "Home", icon: RiHome2Line, path: "/home" },
  { name: "Generative Agent", icon: MdBackupTable },
  { name: "Executions", icon: MdOutlineVerified },
  { name: "Integrations", icon: MdInsights },
  { name: "Reports", icon: TbReportAnalytics },
  { name: "Settings", icon: CiSettings },
];

export const projectSidebarItems = [
  { name: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
  { name: "Requirements", icon: MdChecklist, path: "/requirements" },
  { name: "Development", icon: FaLaptopCode, path: "/dashboard" },
  { name: "Testing", icon: AiTwotoneExperiment, path: "/dashboard" },
  { name: "Support", icon: MdOutline3P, path: "/dashboard" },
  { name: "Release", icon: LuCircleFadingArrowUp, path: "/dashboard" },
];

export const projectOptions = [
  "TestomatePOC",
  "E-commerce Platform",
  "Banking System",
  "Educational App",
];
