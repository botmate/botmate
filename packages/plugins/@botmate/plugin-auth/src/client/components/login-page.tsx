import { ApiError, api, toast, useForm, useNavigate } from '@botmate/client';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@botmate/ui';

function LoginPage() {
  const form = useForm();
  const nav = useNavigate();

  function handleLogin(data: Record<string, string>) {
    const email = data.email;
    const password = data.password;

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    api
      .post('/auth/login', {
        email,
        password,
      })
      .then(() => {
        nav('/dashboard');
        toast.success('Logged in successfully');
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          toast.error(err.response?.data.error);
        }
      });
  }

  return (
    <form
      className="h-screen flex justify-center items-center px-4"
      onSubmit={form.handleSubmit(handleLogin)}
    >
      <Card className="w-[24rem]">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            Login
          </CardTitle>
          <CardDescription>
            Welcome back! Please login to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" type="email" {...form.register('email')} />
          <Input
            placeholder="Password"
            type="password"
            autoComplete="off"
            {...form.register('password')}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LoginPage;
