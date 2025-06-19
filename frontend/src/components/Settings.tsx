"use client";

import { Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "InstaGuard",
    supportEmail: "instaguard7@gmail.com",
    notifyReports: true,
    maintenanceMode: false,
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/admin/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setSettings(data);
        else showMessage("error", "Failed to fetch settings: " + (data.error || "Unknown error"));
      } catch (error) {
        showMessage("error", "Error fetching settings: " + error);
      }
    };

    fetchSettings();
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("success", "Settings saved successfully.");
      } else {
        showMessage("error", "Failed to save settings: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showMessage("error", "Server error occurred.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-pink-100 py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Settings size={48} className="text-pink-600 mx-auto mb-4" />
          <h1 className="section-title py-4">Admin Settings</h1>
          <p className="section-description py-2">
            Manage system-wide configurations and preferences.
          </p>
        </motion.div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 rounded-md px-4 py-3 text-sm font-medium shadow-md text-white text-center ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
              role="alert"
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-pink-200 rounded-2xl shadow-lg p-6 space-y-6 hover:shadow-xl transition"
        >
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
          </div>

          {/* Notify Reports */}
          <div className="flex items-center space-x-3">
            <input
              id="notifyReports"
              type="checkbox"
              name="notifyReports"
              checked={settings.notifyReports}
              onChange={handleChange}
              className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
            />
            <label htmlFor="notifyReports" className="text-sm text-gray-700">
              Send Email Notifications for New Reports
            </label>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center space-x-3">
            <input
              id="maintenanceMode"
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-400"
            />
            <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
              Enable Maintenance Mode
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-rose-500 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-rose-600 duration-300 shadow hover:shadow-md flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
