"use client"
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import RecentSensor from "@/components/recentSensor";
import SensorReading from "@/components/sensorReading";
import SensorReports from "@/components/sensorReport";
import SystemAlerts from "@/components/systemAlerts";
import Topbar from "@/components/topbar";
interface SensorData {
  id: number;
  timestamp: string;
  component: string;
  status: "Critical" | "Warning" | "OK";
  value: number;
}
interface DataType{
  fuel: number,
  tire: number,
  seatbelt: boolean,
  brake: boolean
}
export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports">("dashboard");
  const [error, setError] = useState<string | null>(null);
  const [data2, setData] = useState<DataType[]>([]);
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









  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://adaptable-neighborly-mapusaurus.glitch.me/');
        if (!res.ok) throw new Error('Network response was not ok');

        const json = await res.json();
        const newItem: DataType = json.data;

        setData(prev => {
          const alreadyExists = prev.some(
            item => JSON.stringify(item) === JSON.stringify(newItem)
          );
          return alreadyExists ? prev : [...prev, newItem];
        });

      } catch (err: any) {
        setError(err.message || "Unknown error");
        console.error("Fetch error:", err);
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);


  

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
  
  return (
   <div className="bg-[#fff]">
      <Topbar generateData={generateRandomData}/>
      {/* <Navbar activeTab={activeTab} setActiveTab={setActiveTab}/>
      {activeTab === "reports" && (
        <SensorReports generateData={generateRandomData} />
      )} */}

      {/* {activeTab === "dashboard" && ( */}
        {/* <> */}
          <SensorReading generateData={generateRandomData} />
          {/* <SystemAlerts generateData={generateRandomData} />
          <RecentSensor generateData={generateRandomData} /> */}
        {/* </> */}
      {/* )} */}
      <Footer/>
   </div>
  );
};

