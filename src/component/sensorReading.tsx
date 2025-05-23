import { useState } from "react";
interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}
export default function SensorReading() { 
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const getSystemStatus = (component: string) => {
    const latestData = sensorData
      .filter((data) => data.component === component)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0];

    return latestData || { status: "Unknown", value: 0, timestamp: "" };
  };

  const fuelStatus = getSystemStatus("Fuel Level");
  const brakeStatus = getSystemStatus("Brake System");
  const seatbeltStatus = getSystemStatus("Seatbelt Connection");
  const tirePressureStatus = getSystemStatus("Tire Pressure");

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-[#ff4444]";
      case "Warning":
        return "bg-[#ffbb33]";
      case "OK":
        return "bg-[#00C851]";
      default:
        return "bg-gray-500";
    }
  };

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-[#ff4444]";
      case "Warning":
        return "text-[#ffbb33]";
      case "OK":
        return "text-[#00C851]";
      default:
        return "text-gray-500";
    }
  };

        return(
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Fuel Level */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Fuel Level
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(fuelStatus.status)}`}
                  >
                    {fuelStatus.status}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {fuelStatus.value}%
                      </span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      width="128"
                      height="128"
                      viewBox="0 0 128 128"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          fuelStatus.status === "Critical"
                            ? "#ff4444"
                            : fuelStatus.status === "Warning"
                              ? "#ffbb33"
                              : "#00C851"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(fuelStatus.value / 100) * 377} 377`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Last updated: {fuelStatus.timestamp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brake System */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Brake System
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(brakeStatus.status)}`}
                  >
                    {brakeStatus.status}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {brakeStatus.value}%
                      </span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      width="128"
                      height="128"
                      viewBox="0 0 128 128"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          brakeStatus.status === "Critical"
                            ? "#ff4444"
                            : brakeStatus.status === "Warning"
                              ? "#ffbb33"
                              : "#00C851"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(brakeStatus.value / 100) * 377} 377`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Last updated: {brakeStatus.timestamp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seatbelt Connection */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Seatbelt Connection
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(seatbeltStatus.status)}`}
                  >
                    {seatbeltStatus.status}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-6xl mb-4">
                    {seatbeltStatus.status === "OK" ? (
                      <i className="fas fa-check-circle text-[#00C851]"></i>
                    ) : (
                      <i className="fas fa-exclamation-triangle text-[#ff4444]"></i>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2 text-gray-800">
                      {seatbeltStatus.status === "OK"
                        ? "Connected"
                        : "Disconnected"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated: {seatbeltStatus.timestamp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tire Pressure */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Tire Pressure
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(tirePressureStatus.status)}`}
                  >
                    {tirePressureStatus.status}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {tirePressureStatus.value}
                      </span>
                      <span className="text-sm ml-1">PSI</span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      width="128"
                      height="128"
                      viewBox="0 0 128 128"
                    >
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke={
                          tirePressureStatus.status === "Critical"
                            ? "#ff4444"
                            : tirePressureStatus.status === "Warning"
                              ? "#ffbb33"
                              : "#00C851"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(tirePressureStatus.value / 40) * 377} 377`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 64 64)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Last updated: {tirePressureStatus.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )
    }