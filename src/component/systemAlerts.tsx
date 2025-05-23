import { useState } from "react";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

interface SystemAlertsProps {
  sensorData: SensorData[];
}

export default function SystemAlerts({ sensorData }: SystemAlertsProps) {
  const criticalAlerts = sensorData.filter(
    (data) => data.status === "Critical",
  );
  const warningAlerts = sensorData.filter((data) => data.status === "Warning");
  const [alertsVisible, setAlertsVisible] = useState(true);

  if (!alertsVisible) return null;

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            System Alerts
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 !rounded-button cursor-pointer whitespace-nowrap"
            onClick={() => setAlertsVisible(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {criticalAlerts.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[#ff4444] font-bold mb-2">
              Critical Alerts
            </h3>
            <div className="space-y-2">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="bg-gray-50 p-3 rounded-md border-l-4 border-[#ff4444] flex justify-between"
                >
                  <div>
                    <span className="font-bold text-gray-800">
                      {alert.component}
                    </span>
                    : {alert.component === "Tire Pressure" ? `${alert.value} PSI` : `${alert.value}%`}
                    <p className="text-sm text-gray-500">
                      {alert.timestamp}
                    </p>
                  </div>
                  <div className="text-[#ff4444] font-bold">
                    {alert.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {warningAlerts.length > 0 && (
          <div>
            <h3 className="text-[#ffbb33] font-bold mb-2">
              Warning Alerts
            </h3>
            <div className="space-y-2">
              {warningAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="bg-gray-50 p-3 rounded-md border-l-4 border-[#ffbb33] flex justify-between"
                >
                  <div>
                    <span className="font-bold text-gray-800">
                      {alert.component}
                    </span>
                    : {alert.component === "Tire Pressure" ? `${alert.value} PSI` : `${alert.value}%`}
                    <p className="text-sm text-gray-500">
                      {alert.timestamp}
                    </p>
                  </div>
                  <div className="text-[#ffbb33] font-bold">
                    {alert.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}