import { Card, CardDescription, CardHeader, CardTitle } from '@botmate/ui';

function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
          <CardDescription>
            Sorry, the page you were looking for could not be found.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default NotFoundPage;
