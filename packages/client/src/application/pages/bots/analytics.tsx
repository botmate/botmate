import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@botmate/ui';
import { Bar, BarChart, XAxis } from 'recharts';

import PageLayout from '../../layouts/page';

const chartData = [
  { week: 'Friday', count: 189 },
  { week: 'Saturday', count: 239 },
  { week: 'Sunday', count: 349 },
  { week: 'Monday', count: 200 },
  { week: 'Tuesday', count: 300 },
  { week: 'Wednesday', count: 200 },
  { week: 'Thursday', count: 278 },
];

const chartConfig = {
  count: {
    label: 'Messages',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

function AnalyticsPage() {
  return (
    <PageLayout title="Analytics">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>98.4k</CardTitle>
              <CardDescription className="text-sm">Total Users</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>876</CardTitle>
              <CardDescription className="text-sm">
                Total Groups
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader
            actions={
              <Select defaultValue="last-week">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Last week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last week</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            <CardTitle className="text-md">Messages</CardTitle>
            <CardDescription className="text-sm">
              Messages handled by your bot each day
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey="count" fill="var(--color-count)" />
                <XAxis dataKey="week" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

export default AnalyticsPage;
