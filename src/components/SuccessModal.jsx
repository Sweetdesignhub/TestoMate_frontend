import React from "react";
import { BiCheckCircle } from "react-icons/bi";

export default function SuccessModal({ show, projectName, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto flex flex-col items-center p-8">
        <BiCheckCircle className="text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          You have successfully created project
        </h2>
        <p className="text-lg font-semibold text-[#EB1700] mb-6 text-center">
          {projectName}
        </p>
        <button
          onClick={onClose}
          className="px-8 py-2 bg-[#EB1700] text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Ok
        </button>
      </div>
    </div>
  );
} 