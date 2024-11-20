import React, { Component } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5"
        >
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong!</h1>
          <p className="text-lg text-gray-600 mb-6">{this.state.error?.message || "An unexpected error occurred."}</p>
          <div className="flex gap-4">
            <button
              onClick={this.resetError}
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
            <Link
              to="/"
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Go to Home
            </Link>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
