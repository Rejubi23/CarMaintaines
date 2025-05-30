import { useState, useEffect } from "react";

interface DataType {
  brake: boolean,
  brakeStatus: string,
  fuel: number,
  fuelStatus: string,
  seatbelt: boolean,
  seatbeltStatus: string,
  tire: number,
  tireStatus: string,
}



interface DataPropType {
  data: Array<DataType>
}
export default function SystemAlerts({ data }: DataPropType) {
  const [lastData, setLastData] = useState<DataType | undefined>(undefined);

  useEffect(() => {
    setLastData(data[data.length - 1])
    console.log(lastData)
  }, [data])



  const criticalAlerts = lastData
    ? Object.entries(lastData).filter(([key, value]) => {
      return (
        (key === "fuel" && typeof value === "number" && value <= 30) ||
        (key === "tire" && typeof value === "number" && value <= 30) ||
        (key === "brake" && value === false) ||
        (key === "seatbelt" && value === false)
      );
    })
    : [];


  const warningAlerts = lastData
    ? Object.entries(lastData).filter(([key, value]) => {
      return (
        (key === "fuel" && typeof value === "number" && value > 30 && value <= 60) ||
        (key === "tire" && typeof value === "number" && value > 30 && value <= 60)
      );
    })
    : [];


  const [alertsVisible, setAlertsVisible] = useState(true);

  if (!alertsVisible) return null;

  return (
    <div className="container mx-auto pb-8">
      {alertsVisible &&
        (criticalAlerts.length > 0 || warningAlerts.length > 0) && (
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

              {criticalAlerts.map(([key], index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 my-4 rounded-md border-l-4 border-[#ff4444] flex justify-between"
                >
                  <div>
                    <span className="font-bold text-gray-800">
                      {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize key */}
                    </span>
                  </div>
                  <div className="text-[#ff4444] font-bold">CRITICAL</div>
                </div>
              ))}

              {warningAlerts.length > 0 && (
                <div>
                  <h3 className="text-[#ffbb33] font-bold mb-2">
                    Warning Alerts
                  </h3>
                  <div className="space-y-2">
                    {warningAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-md border-l-4 border-[#ffbb33] flex justify-between"
                      >
                        <div>
                          <span className="font-bold text-gray-800">
                            {alert}
                          </span>
                        </div>
                        <div className="text-[#ffbb33] font-bold">
                          {"WARNING"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}