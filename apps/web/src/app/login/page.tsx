'use client';

import { signIn } from 'next-auth/react';
import { Input, Button } from '@nextui-org/react';
import Image from 'next/image';
import { toast } from 'sonner';

function LoginPage() {
  function handleGithubLogin() {
    signIn('github', { callbackUrl: '/bots' });
  }

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600 space-y-8">
        <div className="text-center">
          <Image
            alt="botmate logo"
            src="/botmate.png"
            width="80"
            height="80"
            className="mx-auto rounded-3xl"
          />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p className="">
              Don&apos;t have an account?
              <a className="ml-2 font-medium text-primary">Sign up</a>
            </p>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="font-medium">Email</label>
            <Input
              type="email"
              required
              className="w-full input input-bordered mt-2"
              placeholder="you@domain.com"
            />
          </div>
          <Button color="primary" fullWidth>
            Sign in
          </Button>
        </form>
        <div className="relative">
          <span className="block w-full h-px bg-gray-300"></span>
          <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">
            Or continue with
          </p>
        </div>
        <div className="space-y-4 text-sm font-medium">
          <button
            onClick={() => toast.error('Google login is not yet implemented')}
            className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
          >
            <Image
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/7cd06bf1d8859c578c2efbfda2c68bd6bedc66d8/google-icon.svg"
              alt="Google"
              height={20}
              width={20}
            />
            Continue with Google
          </button>

          <button
            onClick={() => toast.error('Twitter login is not yet implemented')}
            className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
          >
            <Image
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/f7119b9bdd8c58864383802fb92c7fc3a25c0646/twitter-icon.svg"
              alt="Twitter"
              width={20}
              height={20}
            />
            Continue with Twitter
          </button>

          <button
            onClick={() => handleGithubLogin()}
            className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
          >
            <Image
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/0d3b55a09c6bb8155ca19f43283dc6d88ff88bf5/github-icon.svg"
              alt="Github"
              width={20}
              height={20}
            />
            <span x-show="!loading">Continue with Github</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
