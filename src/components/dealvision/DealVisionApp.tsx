"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dealInputSchema, defaultDealInput } from '@/types';
import type { DealInput, DealOutput } from '@/types';
import { calculateDealMetrics } from '@/lib/deal-calculations';

import { AppHeader } from './Header';
import { InputForm } from './InputForm';
import { KpiDashboard } from './KpiDashboard';
import { ChartsSection } from './ChartsSection';
import { ComparablesTool } from './ComparablesTool';
import { SummaryReport } from './SummaryReport';
import { Building2 } from 'lucide-react';

export default function DealVisionApp() {
  const [dealOutput, setDealOutput] = useState<DealOutput | null>(null);

  const form = useForm<DealInput>({
    resolver: zodResolver(dealInputSchema),
    defaultValues: defaultDealInput,
    mode: 'onBlur',
  });

  const watchedInputs = form.watch();

  const currentInputs = useMemo(() => {
    const parsed = dealInputSchema.safeParse(watchedInputs);
    return parsed.success ? parsed.data : null;
  }, [watchedInputs]);

  useEffect(() => {
    if (currentInputs) {
      const output = calculateDealMetrics(currentInputs);
      setDealOutput(output);
    }
  }, [currentInputs]);

  const handleReset = () => {
    form.reset(defaultDealInput);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="no-print">
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <Building2 className="text-primary size-7" />
                <h1 className="text-2xl font-bold tracking-tighter text-primary group-data-[collapsible=icon]:hidden">
                    DealVision
                </h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <InputForm form={form} />
        </SidebarContent>
        <SidebarSeparator />
        <SidebarContent>
            <ComparablesTool />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
            <AppHeader onReset={handleReset} />
            <main className="flex-1 p-4 md:p-6 space-y-6">
                {dealOutput && <KpiDashboard output={dealOutput} />}
                {dealOutput && currentInputs && (
                    <Tabs defaultValue="charts">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto no-print">
                            <TabsTrigger value="charts">Visualizations</TabsTrigger>
                            <TabsTrigger value="summary">Summary Report</TabsTrigger>
                        </TabsList>
                        <TabsContent value="charts" className="no-print">
                            <ChartsSection output={dealOutput} inputs={currentInputs} />
                        </TabsContent>
                        <TabsContent value="summary" id="summary-report-content">
                            <SummaryReport output={dealOutput} inputs={currentInputs} />
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
