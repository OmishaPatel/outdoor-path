'use client';

// Event Full Client Component
// Handles waitlist modal and interactive elements

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { EventHero } from '@/components/events/EventHero';
import { EventInfoCard } from '@/components/events/EventInfoCard';
import { CapacityDisplay } from '@/components/events/CapacityDisplay';
import { WaitlistModal } from '@/components/modals/WaitlistModal';
import { EventWithOrganizer } from '@/types/event';
import { AlertCircle, Users, ArrowLeft, Bell } from 'lucide-react';

interface EventFullClientProps {
  event: EventWithOrganizer;
  waitlistCount: number;
}

export function EventFullClient({ event, waitlistCount }: EventFullClientProps) {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);

  // Handle joining waitlist
  const handleJoinWaitlist = async () => {
    // TODO: Phase 5 - Integrate with Supabase
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsOnWaitlist(true);
    setShowWaitlistModal(false);
  };

  return (
    <>
      {/* Event Hero with Full overlay */}
      <EventHero
        title={event.title}
        imageUrl={event.hero_image_url}
        status={event.status}
        category={event.category}
        height="md"
      />

      {/* Main Content */}
      <div className="bg-[var(--color-gray-50)] py-8">
        <Container size="lg">
          {/* Event Full Alert */}
          <Card className="mb-8 bg-[var(--color-warning)]/10 border-2 border-[var(--color-warning)]">
            <CardBody className="py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-warning)]/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-[var(--color-warning)]" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[var(--color-gray-900)] mb-2">
                    This Event is Full
                  </h2>
                  <p className="text-[var(--color-gray-700)] mb-4">
                    All {event.max_capacity} spots have been filled. However, you can join the waitlist
                    and we&apos;ll notify you immediately if a spot becomes available.
                  </p>

                  {/* Waitlist Info */}
                  <div className="bg-white rounded-[var(--radius-md)] p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Bell size={20} className="text-[var(--color-primary)]" />
                      <h3 className="font-semibold text-[var(--color-gray-900)]">
                        How the Waitlist Works
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-gray-700)]">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-primary)] font-bold">1.</span>
                        <span>Join the waitlist by clicking the button below</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-primary)] font-bold">2.</span>
                        <span>If someone cancels, you&apos;ll receive an instant notification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--color-primary)] font-bold">3.</span>
                        <span>You&apos;ll have 2 hours to claim the spot before it goes to the next person</span>
                      </li>
                    </ul>
                  </div>

                  {/* Waitlist Stats */}
                  <div className="flex items-center gap-4 text-sm text-[var(--color-gray-600)] mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{waitlistCount} {waitlistCount === 1 ? 'person' : 'people'} on waitlist</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isOnWaitlist ? (
                    <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)] rounded-[var(--radius-md)] p-4">
                      <div className="flex items-center gap-2 text-[var(--color-success)] font-semibold">
                        <Bell size={20} />
                        <span>You&apos;re on the waitlist!</span>
                      </div>
                      <p className="text-sm text-[var(--color-gray-700)] mt-2">
                        We&apos;ll notify you if a spot becomes available.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setShowWaitlistModal(true)}
                        leftIcon={<Bell size={20} />}
                      >
                        Join Waitlist
                      </Button>
                      <Link href="/events">
                        <Button variant="secondary" size="lg">
                          Browse Other Events
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Info */}
            <div>
              <EventInfoCard
                eventDate={event.event_date}
                startTime={event.start_time}
                endTime={event.end_time}
                locationName={event.location_name}
                locationAddress={event.location_address}
                showMapLink
              />
            </div>

            {/* Capacity & Organizer */}
            <div className="space-y-6">
              {/* Capacity Display */}
              <Card>
                <CardHeader title="Event Capacity" />
                <CardBody>
                  <CapacityDisplay
                    current={event.current_capacity}
                    max={event.max_capacity}
                    variant="default"
                    showPercentage
                  />
                </CardBody>
              </Card>

              {/* Organizer Info */}
              <Card>
                <CardHeader title="Organizer" />
                <CardBody>
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={event.organizer.avatar_url}
                      alt={event.organizer.full_name}
                      initials={event.organizer.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-gray-900)]">
                        {event.organizer.full_name}
                      </h3>
                      <p className="text-sm text-[var(--color-gray-600)] mt-1">
                        Event Organizer
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link href={`/events/${event.id}`}>
              <Button variant="ghost" size="lg" leftIcon={<ArrowLeft size={20} />}>
                View Full Event Details
              </Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        open={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
        event={event}
        currentWaitlistCount={waitlistCount}
        onJoin={handleJoinWaitlist}
      />
    </>
  );
}
