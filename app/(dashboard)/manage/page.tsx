'use client';

import * as React from 'react';
import Container from '@/components/Container';
import CurrencyComboBox from '@/components/CurrencyComboBox';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TransactionType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';
import CreateCategoryDialog from '../_components/CreateCategoryDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog';

function ManagePage() {
  return (
    <>
      {/* HEADER */}
      <div className="border-b bg-card">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </Container>
      </div>
      {/* END HEADER */}
      <Container className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </Container>
    </>
  );
}

export default ManagePage;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader className="gap-0">
          <CardTitle className="flex items-center justify-between gap-2 text-2xl">
            <div className="flex items-center gap-2">
              {type === 'expense' ? (
                <TrendingDown className="size-12 items-center rounded-lg bg-rose-400/10 p-2 text-rose-500" />
              ) : (
                <TrendingUp className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === 'expense' ? 'Expense' : 'Income'} categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="size-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{' '}
              <span
                className={cn(
                  'm-1',
                  type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {type}
              </span>{' '}
              categories yet
            </p>

            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}

        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/10 dark:shadow-white/10">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span className="text-xl">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-rose-500/50 hover:text-white"
            variant={'secondary'}
          >
            <TrashIcon className="size-4" /> Remove
          </Button>
        }
      />
    </div>
  );
}
