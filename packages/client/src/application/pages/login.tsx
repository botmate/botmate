import { TRPCClientError } from '@trpc/react-query';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@botmate/ui';
import Cookie from 'js-cookie';
import { toast } from 'sonner';

import { trpc } from '../trpc';

function LoginPage() {
  const nav = useNavigate();
  const login = trpc.login.useMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    try {
      await login.mutateAsync({ username, password }).then((token) => {
        Cookie.set('_bmat', token);
        nav('/');
      });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast.error(e.message);
      }
    }
  }

  return (
    <form
      className="h-[100dvh] flex items-center justify-center"
      onSubmit={handleSubmit}
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" name="username" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" isLoading={login.isLoading}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginPage;
