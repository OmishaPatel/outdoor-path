// Event Detail Page
// Server component for data fetching, client wrapper for modals
// TODO: Phase 5 - Replace with Supabase queries

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEventById, getAttendeesWithProfiles, getAttendeeCountByStatus } from '@/lib/mock';
import { EventDetailClient } from './EventDetailClient';

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return {
      title: 'Event Not Found | OutdoorPath',
    };
  }

  return {
    title: `${event.title} | OutdoorPath`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.hero_image_url ? [event.hero_image_url] : [],
    },
  };
}

// Server Component for data fetching
export default async function EventDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch event data
  const event = getEventById(id);

  // Handle 404
  if (!event) {
    notFound();
  }

  // Fetch attendees with profiles
  const attendeesWithProfiles = getAttendeesWithProfiles(id);

  // Get attendee counts by status
  const attendeeCounts = getAttendeeCountByStatus(id);

  // Pass data to client component
  return (
    <EventDetailClient
      event={event}
      attendees={attendeesWithProfiles}
      attendeeCounts={attendeeCounts}
    />
  );
}
