import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.message || 'An unknown error occurred during authentication';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        </CardHeader>
        <CardBody>
          <p className="text-gray-700 mb-6">
            {decodeURIComponent(errorMessage)}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button variant="primary" fullWidth>
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" fullWidth>
                Go Home
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
