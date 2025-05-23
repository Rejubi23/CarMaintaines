 import { useState } from "react";
 export default function Footer() {
    return(
 <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Sensor Readings. All rights reserved.</p>
          <p className="text-sm mt-1">
            Last system check: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    )
 }