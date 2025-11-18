import Sidebar from "@/components/sidebar";
import { createTrip } from "@/lib/actions/trips";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddTripPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-trip" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Trip for Traveler
              </h1>
              <p className="text-sm text-gray-500">
                Create a new travel package (flight, hotel, adventure, etc.).
              </p>
              {/* {user && (
                <p className="text-xs text-gray-400 mt-1">
                  User ID: {user.id}
                </p>
              )} */}
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="space-y-6" action={createTrip}>
              {/* Traveler info */}
              <div>
                <label
                  htmlFor="travelerName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Traveler Name (optional)
                </label>
                <input
                  type="text"
                  id="travelerName"
                  name="travelerName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter traveler's name"
                />
              </div>

              {/* Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="destinationCountry"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Destination Country *
                  </label>
                  <input
                    type="text"
                    id="destinationCountry"
                    name="destinationCountry"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. Italy"
                  />
                </div>

                <div>
                  <label
                    htmlFor="destinationCity"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Destination City *
                  </label>
                  <input
                    type="text"
                    id="destinationCity"
                    name="destinationCity"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. Rome"
                  />
                </div>
              </div>

              {/* Hotel + Flight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="hotelName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Hotel (optional)
                  </label>
                  <input
                    type="text"
                    id="hotelName"
                    name="hotelName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. Hilton Rome"
                  />
                </div>

                <div>
                  <label
                    htmlFor="flightNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Flight Number (optional)
                  </label>
                  <input
                    type="text"
                    id="flightNumber"
                    name="flightNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. AC 890"
                  />
                </div>
              </div>

              {/* Package type + price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="packageType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Package Type *
                  </label>
                  <select
                    id="packageType"
                    name="packageType"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent"
                  >
                    <option value="ADVENTURE">Adventure</option>
                    <option value="RELAX">Relax</option>
                    <option value="HONEYMOON">Honeymoon</option>
                    <option value="FAMILY">Family</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="totalPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Total Price (USD) *
                  </label>
                  <input
                    type="number"
                    id="totalPrice"
                    name="totalPrice"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. 1999.99"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent"
                >
                  <option value="BOOKED">Booked</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Trip
                </button>
                <Link
                  href="/trips"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
