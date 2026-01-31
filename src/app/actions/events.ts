'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Create a new event
 */
export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to create an event');
  }

  // Extract and validate form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const event_date = formData.get('event_date') as string;
  const start_time = formData.get('start_time') as string;
  const end_time = formData.get('end_time') as string;
  const location_name = formData.get('location_name') as string;
  const location_address = formData.get('location_address') as string;
  const max_capacity = parseInt(formData.get('max_capacity') as string);
  const difficulty = formData.get('difficulty') as string;
  const visibility = (formData.get('visibility') as string) || 'public';
  const hero_image_url = formData.get('hero_image_url') as string;
  const packing_list_notes = formData.get('packing_list_notes') as string;

  // Optional fields
  const location_lat = formData.get('location_lat')
    ? parseFloat(formData.get('location_lat') as string)
    : null;
  const location_lng = formData.get('location_lng')
    ? parseFloat(formData.get('location_lng') as string)
    : null;
  const elevation = formData.get('elevation')
    ? parseInt(formData.get('elevation') as string)
    : null;
  const pricing_type = (formData.get('pricing_type') as string) || 'free';
  const price = formData.get('price')
    ? parseFloat(formData.get('price') as string)
    : null;

  // Validate required fields
  if (!title || title.trim().length < 3) {
    throw new Error('Title must be at least 3 characters');
  }

  if (!description || description.trim().length < 10) {
    throw new Error('Description must be at least 10 characters');
  }

  if (!category) {
    throw new Error('Category is required');
  }

  if (!event_date) {
    throw new Error('Event date is required');
  }

  // Validate date is in future
  const eventDate = new Date(event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (eventDate < today) {
    throw new Error('Event date must be in the future');
  }

  if (!start_time || !end_time) {
    throw new Error('Start and end times are required');
  }

  // Validate end time is after start time
  const startDateTime = new Date(`${event_date}T${start_time}`);
  const endDateTime = new Date(`${event_date}T${end_time}`);

  if (endDateTime <= startDateTime) {
    throw new Error('End time must be after start time');
  }

  if (!location_name || !location_address) {
    throw new Error('Location details are required');
  }

  if (!max_capacity || max_capacity < 1) {
    throw new Error('Maximum capacity must be at least 1');
  }

  if (!difficulty) {
    throw new Error('Difficulty level is required');
  }

  // Insert event into database
  const { data, error } = await supabase
    .from('events')
    .insert({
      organizer_id: user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      event_date,
      start_time,
      end_time,
      location_name: location_name.trim(),
      location_address: location_address.trim(),
      location_lat,
      location_lng,
      max_capacity,
      current_capacity: 0,
      difficulty,
      elevation,
      pricing_type,
      price,
      visibility,
      status: 'active',
      hero_image_url: hero_image_url || null,
      packing_list_notes: packing_list_notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event. Please try again.');
  }

  // Revalidate pages
  revalidatePath('/events');
  revalidatePath('/dashboard');

  // Redirect to new event page
  redirect(`/events/${data.id}`);
}

/**
 * Update an existing event
 */
export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update an event');
  }

  // Verify ownership
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (fetchError || !event) {
    throw new Error('Event not found');
  }

  if (event.organizer_id !== user.id) {
    throw new Error('You are not authorized to update this event');
  }

  // Extract form data (similar validation as create)
  const updates: Record<string, any> = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    event_date: formData.get('event_date') as string,
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    location_name: formData.get('location_name') as string,
    location_address: formData.get('location_address') as string,
    max_capacity: parseInt(formData.get('max_capacity') as string),
    difficulty: formData.get('difficulty') as string,
    visibility: formData.get('visibility') as string,
    hero_image_url: formData.get('hero_image_url') as string,
    packing_list_notes: formData.get('packing_list_notes') as string,
  };

  // Optional fields
  if (formData.get('location_lat')) {
    updates.location_lat = parseFloat(formData.get('location_lat') as string);
  }
  if (formData.get('location_lng')) {
    updates.location_lng = parseFloat(formData.get('location_lng') as string);
  }
  if (formData.get('elevation')) {
    updates.elevation = parseInt(formData.get('elevation') as string);
  }
  if (formData.get('pricing_type')) {
    updates.pricing_type = formData.get('pricing_type') as string;
  }
  if (formData.get('price')) {
    updates.price = parseFloat(formData.get('price') as string);
  }

  // Update event
  const { error: updateError } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId);

  if (updateError) {
    console.error('Error updating event:', updateError);
    throw new Error('Failed to update event. Please try again.');
  }

  // Revalidate pages
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/events');
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to delete an event');
  }

  // Verify ownership
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('organizer_id, title')
    .eq('id', eventId)
    .single();

  if (fetchError || !event) {
    throw new Error('Event not found');
  }

  if (event.organizer_id !== user.id) {
    throw new Error('You are not authorized to delete this event');
  }

  // Delete event (will cascade to event_attendees)
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (deleteError) {
    console.error('Error deleting event:', deleteError);
    throw new Error('Failed to delete event. Please try again.');
  }

  // Revalidate pages
  revalidatePath('/events');
  revalidatePath('/dashboard');

  // Redirect to dashboard
  redirect('/dashboard');
}

/**
 * Cancel an event (soft delete - changes status)
 */
export async function cancelEvent(eventId: string) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to cancel an event');
  }

  // Verify ownership
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (fetchError || !event) {
    throw new Error('Event not found');
  }

  if (event.organizer_id !== user.id) {
    throw new Error('You are not authorized to cancel this event');
  }

  // Update status to cancelled
  const { error: updateError } = await supabase
    .from('events')
    .update({ status: 'cancelled' })
    .eq('id', eventId);

  if (updateError) {
    console.error('Error cancelling event:', updateError);
    throw new Error('Failed to cancel event. Please try again.');
  }

  // Revalidate pages
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/events');
  revalidatePath('/dashboard');

  return { success: true };
}
