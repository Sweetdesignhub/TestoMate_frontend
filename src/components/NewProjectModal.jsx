// import { IoMdClose, IoMdInformationCircleOutline } from "react-icons/io";
// import { BiError } from "react-icons/bi";
// import { FaSpinner } from "react-icons/fa";

// export default function NewProjectModal({
//   show,
//   onClose,
//   onSubmit,
//   loading,
//   error,
//   newProject,
//   onChange,
// }) {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-auto">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:rounded-2xl mx-auto transform transition-all duration-300 ease-in-out sm:w-[90%] sm:max-w-lg max-h-[90vh] flex flex-col">
//         <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex-shrink-0">
//           <div>
//             <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
//               Create New Project
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-500 mt-1">
//               Set up your project to get started
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-2 hover:bg-gray-100 rounded-full"
//           >
//             <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="px-4 py-6 sm:px-6 overflow-y-auto flex-grow min-h-0">
//           <form onSubmit={onSubmit} className="space-y-6">
//             {/* Project Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Project Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={newProject.name}
//                 onChange={onChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-all"
//                 placeholder="Enter project name"
//                 required
//               />
//             </div>

//             {/* Project Key */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Project Key *
//               </label>
//               <input
//                 type="text"
//                 name="key"
//                 value={newProject.key}
//                 onChange={onChange}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white uppercase transition-all"
//                 placeholder="e.g., TEST, PROJ"
//                 required
//                 maxLength={10}
//               />
//               <div className="flex items-center mt-2 text-xs text-gray-500">
//                 <IoMdInformationCircleOutline className="w-4 h-4 mr-1" />
//                 Must be 2–10 characters.
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={newProject.description}
//                 onChange={onChange}
//                 rows={4}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white resize-none transition-all"
//                 placeholder="Brief description of your project (optional)"
//               />
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
//                 <BiError className="w-6 h-6 mr-2 text-red-500" />
//                 <span className="text-red-700">{error}</span>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="w-full sm:w-1/2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full sm:w-1/2 px-6 py-3 bg-[#EB1700] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>+ Create Project</>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { IoMdClose, IoMdInformationCircleOutline } from "react-icons/io";
import { BiError, BiCheckCircle } from "react-icons/bi"; // Added BiCheckCircle for success icon
import { FaSpinner } from "react-icons/fa";
import { checkProjectKeyExists } from "../utils/jiraApi"; // Import the new API function
import { debounce } from "../utils/debounce"; // Import debounce utility

export default function NewProjectModal({
  show,
  onClose,
  onSubmit,
  loading,
  error,
  newProject,
  onChange,
}) {
  const [keyStatus, setKeyStatus] = useState(null); // null, 'checking', 'exists', 'available'
  const [keyError, setKeyError] = useState(null);

  // Debounced function to check project key availability
  const checkKeyAvailability = debounce(async (key) => {
    if (!key || key.length < 2) {
      setKeyStatus(null);
      setKeyError(null);
      return;
    }

    const keyRegex = /^[A-Z0-9]{2,10}$/;
    if (!keyRegex.test(key.toUpperCase())) {
      setKeyStatus(null);
      setKeyError("Project key must be 2-10 uppercase letters or numbers.");
      return;
    }

    try {
      setKeyStatus("checking");
      setKeyError(null);
      const exists = await checkProjectKeyExists(key.toUpperCase());

      if (exists) {
        setKeyStatus("exists");
        setKeyError("Project key already exists.");
      } else {
        setKeyStatus("available");
        setKeyError(null);
      }
    } catch (error) {
      setKeyStatus(null);
      setKeyError("Unable to check project key. Please try again.");
      console.error(error);
    }
  }, 500);

  // Trigger key availability check when project key changes
  useEffect(() => {
    checkKeyAvailability(newProject.key);
  }, [newProject.key]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:rounded-2xl mx-auto transform transition-all duration-300 ease-in-out sm:w-[90%] sm:max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              Create New Project
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Set up your project to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-4 py-6 sm:px-6 overflow-y-auto flex-grow min-h-0">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white transition-all"
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Project Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Key *
              </label>
              <input
                type="text"
                name="key"
                value={newProject.key}
                onChange={onChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white uppercase transition-all ${
                  keyStatus === "exists"
                    ? "border-red-500"
                    : keyStatus === "available"
                    ? "border-green-500"
                    : ""
                }`}
                placeholder="e.g., TEST, PROJ"
                required
                maxLength={10}
              />
              <div className="flex items-center mt-2 text-xs">
                {keyStatus === "checking" && (
                  <div className="flex items-center text-gray-500">
                    <FaSpinner className="animate-spin w-4 h-4 mr-1" />
                    Checking availability...
                  </div>
                )}
                {keyStatus === "available" && (
                  <div className="flex items-center text-green-500">
                    <BiCheckCircle className="w-4 h-4 mr-1" />
                    Project key is available.
                  </div>
                )}
                {keyError && (
                  <div className="flex items-center text-red-500">
                    <BiError className="w-4 h-4 mr-1" />
                    {keyError}
                  </div>
                )}
                {!keyStatus && !keyError && (
                  <div className="flex items-center text-gray-500">
                    <IoMdInformationCircleOutline className="w-4 h-4 mr-1" />
                    Must be 2–10 characters.
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={newProject.description}
                onChange={onChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 focus:bg-white resize-none transition-all"
                placeholder="Brief description of your project (optional)"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                <BiError className="w-6 h-6 mr-2 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 px-6 py3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading || keyStatus === "exists" || keyStatus === "checking"
                }
                className="w-full sm:w-1/2 px-6 py-3 bg-[#EB1700] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>+ Create Project</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
