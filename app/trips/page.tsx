import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import { deleteTrip } from "@/lib/actions/trips";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Trip } from "@prisma/client";
import Link from "next/link";

type TripsSearchParams = {
  q?: string;
  page?: string;
};

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<TripsSearchParams>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;

  // ✅ Next.js requires awaiting searchParams (it is a Promise)
  const resolved = await searchParams;

  const q = (resolved.q ?? "").trim();
  const page = Math.max(1, Number(resolved.page ?? "1"));
  const pageSize = 5;

  const where = {
    userId,
    ...(q
      ? {
          OR: [
            {
              travelerName: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              destinationCountry: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              destinationCity: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
            {
              hotelName: {
                contains: q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [totalCount, items] = (await Promise.all([
    prisma.trip.count({ where }),
    prisma.trip.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])) as [number, Trip[]];

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/trips" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Trips
              </h1>
              <p className="text-sm text-gray-500">
                Manage international trips, hotels, flights, and packages.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <form className="flex gap-2" action="/trips" method="GET">
              <input
                name="q"
                placeholder="Search by traveler, destination, hotel..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                defaultValue={q}
              />
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Search
              </button>
            </form>
          </div>

          {/* Trips table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Traveler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((trip) => {
                  // Booking ID like PLXXXXX (5 digits derived from id)
                  const bookingCode = `PL${String(trip.id)
                    .replace(/\D/g, "")
                    .slice(-5)
                    .padStart(5, "0")}`;

                  return (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {bookingCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.travelerName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.destinationCity}, {trip.destinationCountry}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.hotelName || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.flightNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.packageType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString()} –{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${trip.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {trip.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/trips/${trip.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                          <form
                            action={async (formData: FormData) => {
                              "use server";
                              await deleteTrip(formData);
                            }}
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={trip.id}
                            />
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No trips found. Try adjusting your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/trips"
                searchParams={{
                  q,
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
