import { useState } from "react";

{/* Navigation Tabs */}
export default function Navbar() {
   const [activeTab, setActiveTab] = useState<"dashboard" | "reports">(
    "dashboard",
  );
    return (
<div className="container mx-auto px-4 py-4">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium !rounded-button cursor-pointer whitespace-nowrap ${activeTab === "dashboard" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`py-2 px-4 font-medium !rounded-button cursor-pointer whitespace-nowrap ${activeTab === "reports" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </button>
        </div>
      </div>
    )
}
