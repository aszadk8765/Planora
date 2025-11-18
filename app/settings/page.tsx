import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/settings" />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Admin Settings
              </h1>
              <p className="text-sm text-gray-500">
                Manage your admin account, app configuration, and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="max-w-6xl space-y-6">

          {/* ───────────────────── Account Settings ───────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h2>

            {/* Stack Auth Settings */}
            <AccountSettings fullPage />
          </div>

          {/* ───────────────────── App Settings (Optional) ───────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Planora App Subscription
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Configure subscription pricing
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Price
                </label>
                <input
                  type="number"
                  placeholder="Enter default rate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Fee
                </label>
                <input
                  type="number"
                  placeholder="Enter cancellation fee"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* ───────────────────── Driver Settings Section (Optional) ───────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              User Management Settings
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Configure user approval rules.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoApproveDrivers"
                  className="w-4 h-4"
                />
                <label
                  htmlFor="autoApproveDrivers"
                  className="text-sm text-gray-700"
                >
                  Automatically approve new user registrations
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showDriverRatings"
                  className="w-4 h-4"
                />
                <label
                  htmlFor="showDriverRatings"
                  className="text-sm text-gray-700"
                >
                  Enable user rating system
                </label>
              </div>
            </div>
          </div>

          {/* ───────────────────── Admin Danger Zone ───────────────────── */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-4">
              Danger Zone
            </h2>

            <div className="space-y-4">
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Account
              </button>
              <p className="text-xs text-gray-500">
                Deleting your admin account will remove your access but will not
                delete system trip data.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
