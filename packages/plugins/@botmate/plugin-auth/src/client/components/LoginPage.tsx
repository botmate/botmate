import { useRef } from 'react';

import { ApiError, api, toast, useNavigate } from '@botmate/client';
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
  const nav = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleLogin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    api
      .post('/auth/login', {
        email,
        password,
      })
      .then(() => {
        nav('/');
        toast.success('Logged in successfully');
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          toast.error(err.response?.data.error);
        }
      });
  }

  return (
    <div className="h-screen flex justify-center items-center px-4">
      <Card className="w-[24rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Welcome back! Please login to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" type="email" ref={emailRef} />
          <Input placeholder="Password" type="password" ref={passwordRef} />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage;
