// app/destinations/page.tsx
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

// Shape of what we need to render each card
type DestinationCardData = {
  slug: string;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
  thingsToDo: number;
};

// Fallback list shown when DB has no destinations yet
const fallbackDestinations: DestinationCardData[] = [
  {
    slug: "london",
    name: "London",
    city: "London",
    country: "United Kingdom",
    imageUrl:
      "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 3889,
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    city: "Istanbul",
    country: "Turkey",
    imageUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 2737,
  },
  {
    slug: "paris",
    name: "Paris",
    city: "Paris",
    country: "France",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 3880,
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    city: "Hamburg",
    country: "Germany",
    imageUrl:
      "https://wallpapercave.com/wp/wp1996095.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 365,
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1895,
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    city: "Lisbon",
    country: "Portugal",
    imageUrl:
      "https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 3828,
  },
  {
    slug: "rome",
    name: "Rome",
    city: "Rome",
    country: "Italy",
    imageUrl:
      "https://thumbs.dreamstime.com/b/beautiful-view-ruins-colosseum-rome-italy-june-june-69176135.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 6778,
  },
  {
    slug: "athens",
    name: "Athens",
    city: "Athens",
    country: "Greece",
    imageUrl:
      "https://images.unsplash.com/photo-1549632891-a0bea6d0355b?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 3349,
  },
  {
    slug: "berlin",
    name: "Berlin",
    city: "Berlin",
    country: "Germany",
    imageUrl:
      "https://wallpaperaccess.com/full/8175051.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 894,
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    imageUrl:
      "https://periodicadventures.com/wp-content/uploads/2024/10/Barcelona-Spain-from-Park-Guell-1024x683.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 2509,
  },
  {
    slug: "venice",
    name: "Venice",
    city: "Venice",
    country: "Italy",
    imageUrl:
      "https://deih43ym53wif.cloudfront.net/venice-italy-shutterstock_759608542_0bc86b2a60.jpeg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1762,
  },
  {
    slug: "malaga",
    name: "Málaga",
    city: "Málaga",
    country: "Spain",
    imageUrl:
      "https://images.unsplash.com/photo-1520962922320-2038eebab146?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 823,
  },
  {
    slug: "vienna",
    name: "Vienna",
    city: "Vienna",
    country: "Austria",
    imageUrl:
      "https://thumbs.dreamstime.com/b/town-hall-vienna-11409718.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1013,
  },
  {
    slug: "porto",
    name: "Porto",
    city: "Porto",
    country: "Portugal",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/e7/8b/62.jpg?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1166,
  },
  {
    slug: "stockholm",
    name: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 509,
  },
  {
    slug: "monte-carlo",
    name: "Monte Carlo",
    city: "Monte Carlo",
    country: "Monaco",
    imageUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 115,
  },
  // extra to make 20 total
  {
    slug: "prague",
    name: "Prague",
    city: "Prague",
    country: "Czech Republic",
    imageUrl:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1820,
  },
  {
    slug: "dubai",
    name: "Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    imageUrl:
      "https://images.unsplash.com/photo-1527409335569-f0e5c91fa707?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 2410,
  },
  {
    slug: "singapore",
    name: "Singapore",
    city: "Singapore",
    country: "Singapore",
    imageUrl:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 1310,
  },
  {
    slug: "new-york",
    name: "New York",
    city: "New York",
    country: "United States",
    imageUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    thingsToDo: 4210,
  },
];

type DestinationWithCount = Prisma.DestinationGetPayload<{
  include: { _count: { select: { events: true } } };
}>;

export default async function DestinationsPage() {
  // keep auth in case you need user-specific destinations later
  const user = await getCurrentUser();

  const dbDestinations: DestinationWithCount[] =
    await prisma.destination.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { events: true } },
      },
    });

  // If DB has data, use it; otherwise use the static fallback list
  const cards: DestinationCardData[] =
    dbDestinations.length > 0
      ? dbDestinations.map((d) => ({
          slug: d.slug,
          name: d.name,
          city: d.city,
          country: d.country,
          imageUrl: d.imageUrl,
          thingsToDo: d._count.events,
        }))
      : fallbackDestinations;

  const numberFormatter = new Intl.NumberFormat("en-US");

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/destinations" />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Destinations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore cities around the world and discover experiences,
            tours, and activities for your travelers.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((destination) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className="group relative block overflow-hidden rounded-xl shadow-sm bg-gray-900/90 h-56"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${destination.imageUrl})` }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Text */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h2 className="text-lg font-semibold text-white">
                  {destination.name}
                </h2>
                <p className="text-sm text-gray-200">
                  {numberFormatter.format(destination.thingsToDo)} things to do
                </p>
                <p className="text-xs text-gray-300">
                  {destination.city}, {destination.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
