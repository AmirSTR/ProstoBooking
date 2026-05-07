import type { Metadata } from "next";

import { BookingFlow } from "@/features/bookings/components/booking-flow";
import { getPublicBookingPageData } from "@/features/bookings/queries";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Choose a service, date, and time to book an appointment.",
};

type BookingPageProps = {
  params: Promise<{
    businessSlug: string;
  }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { businessSlug } = await params;
  const data = await getPublicBookingPageData(businessSlug);

  return <BookingFlow data={data} />;
}
