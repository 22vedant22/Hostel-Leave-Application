import React, { useState } from "react";

const Settings = () => {
  const [autoApproveWeekends, setAutoApproveWeekends] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appAlerts, setAppAlerts] = useState(true);

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 min-h-screen pt-16">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        Your account settings at a glance...
      </p>

      {/* System Settings */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          System Settings
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Auto-approve Weekends</p>
            <p className="text-sm text-gray-500">
              Automatically approve leave requests for weekends.
            </p>
          </div>
          <button
            onClick={() => setAutoApproveWeekends(!autoApproveWeekends)}
            className={`w-12 h-6 flex items-center rounded-full transition ${
              autoApproveWeekends ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                autoApproveWeekends ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Notification Settings
        </h3>

        {/* Email Notifications */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium text-gray-800">Email Notifications</p>
            <p className="text-sm text-gray-500">
              Receive email notifications for leave requests.
            </p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`w-12 h-6 flex items-center rounded-full transition ${
              emailNotifications ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                emailNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between py-3 border-b">
          <div>
            <p className="font-medium text-gray-800">SMS Notifications</p>
            <p className="text-sm text-gray-500">
              Receive sms notifications for leave requests.
            </p>
          </div>
          <button
            onClick={() => setSmsNotifications(!smsNotifications)}
            className={`w-12 h-6 flex items-center rounded-full transition ${
              smsNotifications ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                smsNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* App Alerts */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-800">App Alerts</p>
            <p className="text-sm text-gray-500">
              Receive in-app notifications for leave requests.
            </p>
          </div>
          <button
            onClick={() => setAppAlerts(!appAlerts)}
            className={`w-12 h-6 flex items-center rounded-full transition ${
              appAlerts ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                appAlerts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
