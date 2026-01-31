// Browse Events Page
// Server component for fetching events data

import { getEvents } from '@/lib/supabase/queries/events';
import { EventsPageClient } from './EventsPageClient';

export default async function BrowseEventsPage() {
  // Fetch all public events from Supabase
  const events = await getEvents();

  return <EventsPageClient events={events} />;
}
