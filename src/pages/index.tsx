"use client"
import React, { useState, useEffect } from "react";
import * as echarts from "echarts";

interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}

export default function Home() {
   const [activeTab, setActiveTab] = useState<"dashboard" | "reports">(
    "dashboard",
  );
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alertsVisible, setAlertsVisible] = useState(true);

  // Generate mock sensor data
  useEffect(() => {
    const components = [
      "Fuel Level",
      "Brake System",
      "Seatbelt Connection",
      "Tire Pressure",
    ];
    const statuses: ("Critical" | "Warning" | "OK")[] = [
      "Critical",
      "Warning",
      "OK",
    ];

    const generateRandomData = (): SensorData[] => {
      const data: SensorData[] = [];

      // Current time
      const now = new Date();

      // Generate data for each component
      for (let i = 0; i < 20; i++) {
        const component =
          components[Math.floor(Math.random() * components.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Generate a random timestamp within the last 24 hours
        const pastTime = new Date(
          now.getTime() - Math.random() * 24 * 60 * 60 * 1000,
        );
        const timestamp = pastTime
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);

        // Generate appropriate values based on status and component
        let value = 0;
        if (component === "Fuel Level") {
          value =
            status === "Critical"
              ? Math.floor(Math.random() * 15)
              : status === "Warning"
                ? 15 + Math.floor(Math.random() * 20)
                : 35 + Math.floor(Math.random() * 65);
        } else if (component === "Brake System") {
          value =
            status === "Critical"
              ? Math.floor(Math.random() * 20)
              : status === "Warning"
                ? 20 + Math.floor(Math.random() * 30)
                : 50 + Math.floor(Math.random() * 50);
        } else if (component === "Seatbelt Connection") {
          value = status === "Critical" ? 0 : status === "Warning" ? 50 : 100;
        } else if (component === "Tire Pressure") {
          value =
            status === "Critical"
              ? 15 + Math.floor(Math.random() * 10)
              : status === "Warning"
                ? 25 + Math.floor(Math.random() * 5)
                : 30 + Math.floor(Math.random() * 10);
        }

        data.push({
          id: i + 1,
          timestamp,
          component,
          status,
          value,
        });
      }

      // Sort by timestamp (newest first)
      return data.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    };

    setSensorData(generateRandomData());
  }, []);

  // Initialize charts
  useEffect(() => {
    if (activeTab === "reports" && sensorData.length > 0) {
      // Component distribution chart
      const componentChart = echarts.init(
        document.getElementById("component-chart"),
      );
      const componentCounts: Record<string, number> = {};

      sensorData.forEach((data) => {
        componentCounts[data.component] =
          (componentCounts[data.component] || 0) + 1;
      });

      const componentOption = {
        animation: false,
        backgroundColor: "#ffffff",
        title: {
          text: "Component Distribution",
          left: "center",
          textStyle: {
            color: "#333333",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#333333",
          },
        },
        series: [
          {
            name: "Components",
            type: "pie",
            radius: "60%",
            data: Object.keys(componentCounts).map((key) => ({
              name: key,
              value: componentCounts[key],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                color: function (params: any) {
                  const colorList = [
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800",
                    "#E91E63",
                  ];
                  return colorList[params.dataIndex % colorList.length];
                },
              },
            },
            label: {
              color: "#333333",
            },
          },
        ],
      };

      componentChart.setOption(componentOption);

      // Status distribution chart
      const statusChart = echarts.init(document.getElementById("status-chart"));
      const statusCounts: Record<string, number> = {};

      sensorData.forEach((data) => {
        statusCounts[data.status] = (statusCounts[data.status] || 0) + 1;
      });

      const statusOption = {
        animation: false,
        backgroundColor: "#ffffff",
        title: {
          text: "Alert Status Distribution",
          left: "center",
          textStyle: {
            color: "#333333",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          textStyle: {
            color: "#333333",
          },
        },
        series: [
          {
            name: "Status",
            type: "pie",
            radius: "60%",
            data: Object.keys(statusCounts).map((key) => ({
              name: key,
              value: statusCounts[key],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                color: function (params: any) {
                  const colorMap: Record<string, string> = {
                    Critical: "#ff4444",
                    Warning: "#ffbb33",
                    OK: "#00C851",
                  };
                  return colorMap[params.name] || "#2196F3";
                },
              },
            },
            label: {
              color: "#333333",
            },
          },
        ],
      };

      statusChart.setOption(statusOption);

      // Timeline chart
      const timelineChart = echarts.init(
        document.getElementById("timeline-chart"),
      );

      // Group data by component and prepare for timeline
      const componentData: Record<
        string,
        { time: string[]; values: number[] }
      > = {};

      // Get unique components
      const uniqueComponents = Array.from(
        new Set(sensorData.map((item) => item.component)),
      );

      // Initialize data structure
      uniqueComponents.forEach((component) => {
        componentData[component] = {
          time: [],
          values: [],
        };
      });

      // Fill data
      sensorData.forEach((data) => {
        componentData[data.component].time.push(data.timestamp);
        componentData[data.component].values.push(data.value);
      });

      // Prepare series data
      const series = uniqueComponents.map((component) => ({
        name: component,
        type: "line",
        data: componentData[component].values
          .map((value, index) => [componentData[component].time[index], value])
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()),
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 3,
        },
      }));

      const timelineOption = {
        animation: false,
        backgroundColor: "#ffffff",
        title: {
          text: "Sensor Readings Timeline",
          left: "center",
          textStyle: {
            color: "#333333",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: uniqueComponents,
          bottom: 10,
          textStyle: {
            color: "#333333",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "time",
          axisLabel: {
            color: "#333333",
          },
          axisLine: {
            lineStyle: {
              color: "#333333",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "Value",
          nameTextStyle: {
            color: "#333333",
          },
          axisLabel: {
            color: "#333333",
          },
          axisLine: {
            lineStyle: {
              color: "#333333",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        series: series,
      };

      timelineChart.setOption(timelineOption);

      // Handle resize
      const handleResize = () => {
        componentChart.resize();
        statusChart.resize();
        timelineChart.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        componentChart.dispose();
        statusChart.dispose();
        timelineChart.dispose();
      };
    }
  }, [activeTab, sensorData]);

  // Get critical alerts
  const criticalAlerts = sensorData.filter(
    (data) => data.status === "Critical",
  );
  const warningAlerts = sensorData.filter((data) => data.status === "Warning");

  // Get system status
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

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-car-alt text-3xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-800">
              Sensor Readings
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg !rounded-button cursor-pointer whitespace-nowrap text-gray-700"
                onClick={() => setAlertsVisible(!alertsVisible)}
              >
                <i className="fas fa-bell"></i>
                <span>Alerts</span>
                {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
                  <span className="absolute -top-1 -right-1 bg-[#ff4444] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {criticalAlerts.length + warningAlerts.length}
                  </span>
                )}
              </button>
            </div>
            <span className="text-gray-600">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {activeTab === "dashboard" && (
          <div>
            {/* Vehicle Systems Status */}
            <h2 className="text-2xl font-bold mb-6">Sensor Readings</h2>

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

            {/* Alerts Panel */}
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
                                : {alert.value}%
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
                                : {alert.value}%
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
              )}

            {/* Recent Sensor Readings */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Recent Sensor Readings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-left text-gray-700">
                        Timestamp
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Component
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Value
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorData.slice(0, 10).map((data) => (
                      <tr
                        key={data.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-800">
                          {data.timestamp}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component === "Tire Pressure"
                            ? `${data.value} PSI`
                            : `${data.value}%`}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(data.status)}`}
                          >
                            {data.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Sensor Reports
            </h2>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div id="component-chart" style={{ height: "300px" }}></div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div id="status-chart" style={{ height: "300px" }}></div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 mb-8">
              <div id="timeline-chart" style={{ height: "400px" }}></div>
            </div>

            {/* Detailed Sensor Data */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detailed Sensor Data
                </h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <i className="fas fa-download mr-2"></i>Export
                  </button>
                  <button className="bg-transparent border border-gray-400 text-gray-700 px-4 py-2 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    <i className="fas fa-filter mr-2"></i>Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-4 text-left text-gray-700">ID</th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Timestamp
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Component
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Value
                      </th>
                      <th className="py-2 px-4 text-left text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorData.map((data, index) => (
                      <tr
                        key={data.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="py-3 px-4 text-gray-800">{data.id}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.timestamp}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {data.component === "Tire Pressure"
                            ? `${data.value} PSI`
                            : `${data.value}%`}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(data.status)}`}
                          >
                            {data.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-600">
                  Showing 1 to {sensorData.length} of {sensorData.length}{" "}
                  entries
                </div>
                <div className="flex space-x-2">
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    Previous
                  </button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    1
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded !rounded-button cursor-pointer whitespace-nowrap">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Sensor Readings. All rights reserved.</p>
          <p className="text-sm mt-1">
            Last system check: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

