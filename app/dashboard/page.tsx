import TripsChart from "@/components/trips-chart";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp } from "lucide-react";
import type { Trip } from "@prisma/client";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  // 1) Basic counts
  const [totalTrips, completedCount, cancelledCount] = await Promise.all([
    prisma.trip.count({
      where: { userId },
    }),
    prisma.trip.count({
      where: { userId, status: "COMPLETED" },
    }),
    prisma.trip.count({
      where: { userId, status: "CANCELLED" },
    }),
  ]);

  // 2) All trips for aggregations & chart
  const allTrips: Trip[] = await prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // --- Aggregations ---

  const totalRevenue = allTrips.reduce(
    (sum, trip) => sum + Number(trip.totalPrice ?? 0),
    0
  );

  const upcomingCount = allTrips.filter(
    (t) => t.status === "UPCOMING"
  ).length;

  // For status breakdown we only care about these three
  const statusTotal =
    upcomingCount + completedCount + cancelledCount || 1;

  const upcomingPercentage = Math.round(
    (upcomingCount / statusTotal) * 100
  );
  const completedPercentage = Math.round(
    (completedCount / statusTotal) * 100
  );
  const cancelledPercentage = Math.round(
    (cancelledCount / statusTotal) * 100
  );

  // Angles for conic-gradient pie
  const completedAngle = (completedCount / statusTotal) * 360;
  const upcomingAngle = (upcomingCount / statusTotal) * 360;
  const completedEnd = completedAngle;
  const upcomingEnd = completedAngle + upcomingAngle;
  // Cancelled will fill from upcomingEnd to 360deg

  // --- Weekly trips data for chart (last 12 weeks) ---
  const now = new Date();
  const weeklyTripsData: { week: string; trips: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate()).padStart(2, "0")}`;

    const weekTrips = allTrips.filter((trip) => {
      const date = new Date(trip.createdAt);
      return date >= weekStart && date <= weekEnd;
    });

    weeklyTripsData.push({
      week: weekLabel,
      trips: weekTrips.length,
    });
  }

  // --- Recent trips (last 5) ---
  const recentTrips = allTrips.slice(0, 5);

  // style object for pie chart
  const pieStyle: React.CSSProperties = {
    backgroundImage: `conic-gradient(
      #a855f7 0deg ${completedEnd}deg,        /* Completed - purple */
      #22c55e ${completedEnd}deg ${upcomingEnd}deg, /* Upcoming - green */
      #9ca3af ${upcomingEnd}deg 360deg        /* Cancelled - gray */
    )`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Overview of your international trips, packages, and
                revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Top row: Key metrics + chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Key Metrics
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Total Trips */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {totalTrips}
                </div>
                <div className="text-sm text-gray-600">Total Trips</div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{totalTrips}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              {/* Total Revenue */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  ${Number(totalRevenue).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">
                  Total Revenue
                </div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +${Number(totalRevenue).toFixed(0)}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>

              {/* Completed Trips */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">
                  Completed Trips
                </div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xs text-green-600">
                    +{completedCount}
                  </span>
                  <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Trips over time */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Trips per week
              </h2>
            </div>
            <div className="h-48">
              <TripsChart data={weeklyTripsData} />
            </div>
          </div>
        </div>

        {/* Second row: recent trips + status breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Trips */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Trips
              </h2>
            </div>
            <div className="space-y-3">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {trip.travelerName || "Traveler"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.destinationCity},{" "}
                      {trip.destinationCountry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${Number(trip.totalPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.status}
                    </div>
                  </div>
                </div>
              ))}

              {recentTrips.length === 0 && (
                <p className="text-sm text-gray-500">
                  No trips yet. Create your first international trip.
                </p>
              )}
            </div>
          </div>

          {/* Trip Status Breakdown as Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Trip Status Breakdown
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* Pie chart */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div
                  className="w-48 h-48 rounded-full shadow-inner"
                  style={pieStyle}
                />
                {/* Inner circle to give donut effect */}
                <div className="absolute w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-gray-900">
                    {statusTotal}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    total trips
                  </div>
                </div>
              </div>

            <div className="mt-6 space-y-2 text-sm text-gray-600 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>
                    Completed ({completedPercentage}%)
                  </span>
                </div>
                <span>{completedCount} trips</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>Upcoming ({upcomingPercentage}%)</span>
                </div>
                <span>{upcomingCount} trips</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span>Cancelled ({cancelledPercentage}%)</span>
                </div>
                <span>{cancelledCount} trips</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
