import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function EventNotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] py-16">
      <Container size="md">
        <Card className="text-center">
          <CardBody className="py-12">
            <div className="w-20 h-20 bg-[var(--color-gray-100)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} className="text-[var(--color-gray-400)]" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-gray-900)] mb-3">
              Event Not Found
            </h1>

            <p className="text-[var(--color-gray-600)] mb-8 max-w-md mx-auto">
              We couldn&apos;t find the event you&apos;re looking for. It may have been removed or the link might be incorrect.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/events">
                <Button variant="primary" size="lg">
                  Browse All Events
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="lg" leftIcon={<ArrowLeft size={20} />}>
                  Go Home
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}
