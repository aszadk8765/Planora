import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateTrip } from "@/lib/actions/trips";

type EditTripPageProps = {
  params: { id: string };
};

function formatDateInput(date: Date) {
  // YYYY-MM-DD for <input type="date" />
  return date.toISOString().slice(0, 10);
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const user = await getCurrentUser();

  const trip = await prisma.trip.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!trip) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/trips" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Trip
              </h1>
              <p className="text-sm text-gray-500">
                Update details for this international trip booking.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="space-y-6" action={updateTrip}>
              {/* Hidden trip id */}
              <input type="hidden" name="id" value={trip.id} />

              {/* Traveler */}
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
                  defaultValue={trip.travelerName ?? ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter traveler name"
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
                    defaultValue={trip.destinationCountry}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. France"
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
                    defaultValue={trip.destinationCity}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. Paris"
                  />
                </div>
              </div>

              {/* Hotel & Flight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="hotelName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Hotel Name (optional)
                  </label>
                  <input
                    type="text"
                    id="hotelName"
                    name="hotelName"
                    defaultValue={trip.hotelName ?? ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter hotel name"
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
                    defaultValue={trip.flightNumber ?? ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="e.g. AC123"
                  />
                </div>
              </div>

              {/* Package & Price */}
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
                    defaultValue={trip.packageType}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent"
                  >
                    <option value="FLIGHT_HOTEL">Flight + Hotel</option>
                    <option value="ALL_INCLUSIVE">All Inclusive</option>
                    <option value="HOTEL_ONLY">Hotel Only</option>
                    <option value="CUSTOM">Custom Package</option>
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
                    defaultValue={trip.totalPrice}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="0.00"
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
                    defaultValue={formatDateInput(trip.startDate)}
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
                    defaultValue={formatDateInput(trip.endDate)}
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
                  defaultValue={trip.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-transparent"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="BOOKED">Booked / In Progress</option>
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
                  Save Changes
                </button>
                <a
                  href="/trips"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
