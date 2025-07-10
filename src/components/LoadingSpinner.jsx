import PropTypes from "prop-types";

// Loading spinner component for full-page or inline loading states
export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div
      className={`${
        fullPage
          ? "fixed inset-0 z-50 flex items-center justify-center bg-white"
          : "flex justify-center py-12"
      }`}
    >
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
};
