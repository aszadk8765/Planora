"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

/* ----------------------------------------------
   ZOD schema for manual Add Trip & Edit Trip
------------------------------------------------ */
const TripSchema = z.object({
  travelerName: z.string().min(1, "Traveler name is required"),
  destinationCity: z.string().min(1, "Destination city is required"),
  destinationCountry: z.string().min(1, "Destination country is required"),
  hotelName: z.string().optional(),
  flightNumber: z.string().optional(),
  packageType: z.string().min(1, "Package type is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalPrice: z.coerce.number().nonnegative(),
  status: z.enum(["UPCOMING", "BOOKED", "COMPLETED", "CANCELLED"]),
});

/* ----------------------------------------------
   DELETE TRIP
------------------------------------------------ */
export async function deleteTrip(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  if (!id) throw new Error("Trip ID missing");

  await prisma.trip.deleteMany({
    where: { id, userId: user.id },
  });

  redirect("/trips");
}

/* ----------------------------------------------
   CREATE TRIP (Manual AddTrip Page)
------------------------------------------------ */
export async function createTrip(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = TripSchema.safeParse({
    travelerName: formData.get("travelerName"),
    destinationCity: formData.get("destinationCity"),
    destinationCountry: formData.get("destinationCountry"),
    hotelName: formData.get("hotelName"),
    flightNumber: formData.get("flightNumber"),
    packageType: formData.get("packageType"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    totalPrice: formData.get("totalPrice"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Trip validation failed");
  }

  await prisma.trip.create({
    data: { ...parsed.data, userId: user.id },
  });

  redirect("/trips");
}

/* ----------------------------------------------
   QUICK BOOK FROM DESTINATION / EVENT PAGE
------------------------------------------------ */
export async function quickBookTrip(formData: FormData) {
  const user = await getCurrentUser();

  const travelerName =
    (user.name as string | null) ||
    (formData.get("travelerName") as string) ||
    "Traveler";

  const destinationCity = (formData.get("destinationCity") as string) || "";
  const destinationCountry = (formData.get("destinationCountry") as string) || "";
  const hotelName = (formData.get("hotelName") as string) || "";
  const flightNumber = (formData.get("flightNumber") as string) || "";
  const packageType = (formData.get("packageType") as string) || "STANDARD";

  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const totalPriceStr = formData.get("totalPrice") as string;
  const status = (formData.get("status") as string) || "UPCOMING";

  if (!destinationCity || !destinationCountry) {
    throw new Error("Destination fields missing");
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const totalPrice = Number(totalPriceStr || 0);

  await prisma.trip.create({
    data: {
      userId: user.id,
      travelerName,
      destinationCity,
      destinationCountry,
      hotelName,
      flightNumber,
      packageType,
      startDate,
      endDate,
      totalPrice,
      status,
    },
  });

  redirect("/trips");
}

/* ----------------------------------------------
   UPDATE TRIP  (EDIT PAGE)
------------------------------------------------ */
export async function updateTrip(formData: FormData) {
  const user = await getCurrentUser();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Trip ID is required");

  const parsed = TripSchema.safeParse({
    travelerName: formData.get("travelerName"),
    destinationCity: formData.get("destinationCity"),
    destinationCountry: formData.get("destinationCountry"),
    hotelName: formData.get("hotelName"),
    flightNumber: formData.get("flightNumber"),
    packageType: formData.get("packageType"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    totalPrice: formData.get("totalPrice"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Trip update validation failed");
  }

  await prisma.trip.updateMany({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  redirect("/trips");
}
