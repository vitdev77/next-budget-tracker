import * as React from 'react';
import Container from '@/components/Container';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';

async function page() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect('/wizard');
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👏</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button className="border border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white">
                  New income 😛
                </Button>
              }
              type={'income'}
            />
            <CreateTransactionDialog
              trigger={
                <Button className="border border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white">
                  New expense 😠
                </Button>
              }
              type={'expense'}
            />
          </div>
        </Container>
      </div>

      <div className="flex flex-col gap-4">
        <Overview userSettings={userSettings} />
        <History userSettings={userSettings} />
      </div>
    </div>
  );
}

export default page;
