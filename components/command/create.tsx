'use client';

import { trpc } from '#lib/trpc/client';
import { createCommandSchema } from '#lib/validation/command';
import { Button } from '#ui/button';
import { Card, CardContent, CardHeader } from '#ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#ui/form';
import { Input } from '#ui/input';
import { Textarea } from '#ui/textarea';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRouter } from 'next/navigation';

import PageLayout from '#components/layouts/page';

function CreateCommand({ botId }: { botId: string }) {
  const utils = trpc.useUtils();
  const createCommand = trpc.createCommand.useMutation();

  const r = useRouter();
  const form = useForm<z.infer<typeof createCommandSchema>>({
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof createCommandSchema>) {
    const { name, description } = data;

    // @ts-expect-error prisma JSON object
    createCommand
      .mutateAsync({
        botId,
        name,
        description,
      })
      .then((res) => {
        toast.success('Command created');
        r.push(`/bots/${botId}/commands/${res.id}`);
        utils.getCommands.invalidate();
      });
  }

  return (
    <PageLayout title="Create Command">
      <div className="max-w-3xl mx-auto p-4">
        <Card className="">
          <CardHeader></CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of the command" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What does this command do?"
                          {...field}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" isLoading={createCommand.isLoading}>
                  Create
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

export default CreateCommand;
