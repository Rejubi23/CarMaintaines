import { useState } from "react";

type NavbarProps = {
  activeTab: "dashboard" | "reports";
  setActiveTab: (tab: "dashboard" | "reports") => void;
}
{/* Navigation Tabs */}
export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
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
