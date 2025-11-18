// app/destinations/[slug]/page.tsx
import { quickBookTrip } from "@/lib/actions/trips";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type DestinationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * What we need to render each event card.
 * This is independent from the DB Event model – we map DB rows into this shape.
 */
type EventCardData = {
  id: string;
  title: string;
  hotelName: string;
  flightNumber: string;
  packageType: string; // e.g. ADVENTURE / HONEYMOON / FAMILY / CITY BREAK
  startDate: Date;
  endDate: Date;
  price: number;
  availableSpots: number;
};

/**
 * Fallback 20 “travel packages” for a destination,
 * used when there are no Event rows in the DB.
 */
function generateFallbackEventsForDestination(
  slug: string,
  displayName: string,
  city: string,
  country: string
): EventCardData[] {
  const baseName =
    displayName ||
    slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const packageTypes = [
    "ADVENTURE",
    "HONEYMOON",
    "FAMILY",
    "CITY BREAK",
    "LUXURY",
  ];

  const hotelNames = [
    "Grand Palace Hotel",
    "Sunset Resort",
    "Central Plaza",
    "Skyline Suites",
    "Harbour View Hotel",
  ];

  const flights = [
    "PL124452",
    "PL786820",
    "PL534290",
    "PL908733",
    "PL443211",
  ];

  const today = new Date();
  const events: EventCardData[] = [];

  for (let i = 0; i < 20; i++) {
    const start = new Date(today);
    start.setDate(start.getDate() + 7 + i * 3); // in the future
    const end = new Date(start);
    end.setDate(end.getDate() + 7); // 7-day package

    const pkg = packageTypes[i % packageTypes.length];
    const hotel = hotelNames[i % hotelNames.length];
    const flight = flights[i % flights.length];

    events.push({
      id: `${slug}-fallback-${i + 1}`,
      title: `${baseName} ${pkg} Package`,
      hotelName: hotel,
      flightNumber: flight,
      packageType: pkg,
      startDate: start,
      endDate: end,
      price: 250 + i * 15,
      availableSpots: 5 + (i % 8),
    });
  }

  return events;
}

function getRandomTravelerName() {
  const names = [
    "John",
    "Ava",
    "Liam",
    "Sophia",
    "Noah",
    "Mia",
    "Oliver",
    "Emma",
    "Ethan",
    "Isabella",
    "Lucas",
    "Charlotte",
    "Mason",
    "Amelia",
    "Logan",
    "Harper",
    "Elijah",
    "Aaliyah",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export default async function DestinationDetailPage({
  params,
}: DestinationPageProps) {
  // 🔥 Important: params is a Promise → await it
  const resolved = await params;
  const slug = resolved.slug;

  if (!slug) {
    notFound();
  }

  // If you later want user-specific behaviour
  await getCurrentUser();

  // 1) Load destination
  const destination = await prisma.destination.findUnique({
    where: { slug },
  });

  // Raw values
  const rawName = destination?.name ?? slug;
  const rawCity = destination?.city ?? rawName;
  const country = destination?.country ?? "Worldwide";

  // UPPERCASE for display
  const displayName = rawName.toUpperCase();
  const cityUpper = rawCity.toUpperCase();

  // 2) Try to load real events from DB (if you created an Event model)
  const dbEventsRaw = destination
    ? await prisma.event.findMany({
        where: { destinationId: destination.id },
        orderBy: { startTime: "asc" },
        take: 20,
      })
    : [];

  const dbEvents: EventCardData[] = dbEventsRaw.map((e, index) => ({
    id: e.id,
    title: e.title,
    hotelName: e.title || `${displayName} HOTEL`,
    flightNumber: `PL${(100000 + index).toString().slice(-5)}`,
    packageType: "EXPERIENCE",
    startDate: e.startTime,
    endDate: e.endTime,
    price: Number(e.price ?? 0),
    availableSpots: e.availableSeats ?? 0,
  }));

  // 3) Choose which events to show: DB or fallback 20
  const eventsToShow =
    dbEvents.length > 0
      ? dbEvents
      : generateFallbackEventsForDestination(slug, displayName, rawCity, country);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/destinations" />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {displayName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Hand-picked travel packages for {cityUpper}, {country}. Select a
              package to create a booking.
            </p>
          </div>

          <Link
            href="/destinations"
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            ← Back to Destinations
          </Link>
        </div>

        {/* Events / packages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Packages
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {eventsToShow.map((event) => (
              <div
                key={event.id}
                className="flex flex-col justify-between rounded-lg border border-gray-200 p-4 bg-gray-50 hover:shadow-sm transition-shadow"
              >
                {/* Title */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  {/* Key/value style info similar to Trips table */}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                    <div>
                      <dt className="font-semibold text-gray-700">
                        DESTINATION
                      </dt>
                      <dd>
                        {cityUpper}, {country}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">HOTEL</dt>
                      <dd>{event.hotelName}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">FLIGHT</dt>
                      <dd>{event.flightNumber}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">PACKAGE</dt>
                      <dd>{event.packageType}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">DATES</dt>
                      <dd>
                        {event.startDate.toLocaleDateString()} –{" "}
                        {event.endDate.toLocaleDateString()}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">PRICE</dt>
                      <dd>{currency.format(event.price)}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-gray-700">
                        AVAILABILITY
                      </dt>
                      <dd>{event.availableSpots} spots left</dd>
                    </div>
                  </dl>

                  {/* Book form */}
                  <form
                    action={quickBookTrip}
                    className="mt-4 flex items-center justify-between"
                  >
                    <input
                      type="hidden"
                      name="travelerName"
                      value={getRandomTravelerName()}
                    />
                    {/* store rawCity (not uppercase) in DB */}
                    <input
                      type="hidden"
                      name="destinationCity"
                      value={rawCity}
                    />
                    <input
                      type="hidden"
                      name="destinationCountry"
                      value={country}
                    />
                    <input
                      type="hidden"
                      name="hotelName"
                      value={event.hotelName}
                    />
                    <input
                      type="hidden"
                      name="flightNumber"
                      value={event.flightNumber}
                    />
                    <input
                      type="hidden"
                      name="packageType"
                      value={event.packageType}
                    />
                    <input
                      type="hidden"
                      name="startDate"
                      value={event.startDate.toISOString()}
                    />
                    <input
                      type="hidden"
                      name="endDate"
                      value={event.endDate.toISOString()}
                    />
                    <input
                      type="hidden"
                      name="totalPrice"
                      value={event.price.toString()}
                    />
                    <input type="hidden" name="status" value="UPCOMING" />

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700"
                    >
                      Book Now
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {eventsToShow.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">
              No packages found for this destination yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
