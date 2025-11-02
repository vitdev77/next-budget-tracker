'use client';

import * as React from 'react';
import { UserSettings } from '@prisma/client';
import Container from '@/components/Container';
import { Period, Timeframe } from '@/lib/types';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HistoryPeriodSelector from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';
import { GetHistoryDataResponseType } from '@/app/api/history-data/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import CountUp from 'react-countup';

function History({ userSettings }: { userSettings: UserSettings }) {
  const [timeframe, setTimeframe] = React.useState<Timeframe>('month');
  const [period, setPeriod] = React.useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery<GetHistoryDataResponseType>({
    queryKey: ['overview', 'history', timeframe, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <Container>
      <h2 className="text-3xl font-bold py-6">History</h2>
      <Card className="col-span-12 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-sm"
              >
                <div className="size-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-sm"
              >
                <div className="size-4 rounded-full bg-rose-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={'100%'} height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient
                      id="incomeBar"
                      x1={'0'}
                      y1={'0'}
                      x2={'0'}
                      y2={'1'}
                    >
                      <stop
                        offset={'0'}
                        stopColor="#00bc7d"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#00bc7d"
                        stopOpacity={'0'}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseBar"
                      x1={'0'}
                      y1={'0'}
                      x2={'0'}
                      y2={'1'}
                    >
                      <stop
                        offset={'0'}
                        stopColor="#ff2056"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#ff2056"
                        stopOpacity={'0'}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray={'5 5'}
                    strokeOpacity={'0.2'}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === 'year') {
                        return date.toLocaleDateString('default', {
                          month: 'long',
                        });
                      }

                      return date.toLocaleDateString('default', {
                        day: '2-digit',
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={'income'}
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={'expense'}
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className="flex h-75 flex-col items-center justify-center bg-background gap-0 text-center">
                No data for the selected period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </Container>
  );
}

export default History;

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-75 rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-rose-500"
        textColor="text-rose-500"
      />

      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />

      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
}

function TooltipRow({
  formatter,
  label,
  value,
  bgColor,
  textColor,
}: {
  formatter: Intl.NumberFormat;
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}) {
  const formattingFn = React.useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-center gap-2">
      <div className={cn('size-4 rounded-full', bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn('text-sm font-bold', textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimal={'0'}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
