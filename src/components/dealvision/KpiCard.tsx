"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from '@/lib/utils';

interface KpiCardProps {
    title: string;
    value: number;
    format: 'currency' | 'percent' | 'number';
    icon: React.ReactNode;
    tooltip: string;
}

const formatValue = (value: number, format: KpiCardProps['format']) => {
    if (isNaN(value) || !isFinite(value)) return "N/A";
    switch (format) {
        case 'currency':
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        case 'percent':
            return `${value.toFixed(2)}%`;
        case 'number':
            return value.toLocaleString();
    }
};

export function KpiCard({ title, value, format, icon, tooltip }: KpiCardProps) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        // A simple spring-like animation effect
        const animationFrame = requestAnimationFrame(animate);
        let currentVal = displayValue;

        function animate() {
            const diff = value - currentVal;
            if (Math.abs(diff) > 0.01) {
                currentVal += diff * 0.1;
                setDisplayValue(currentVal);
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [value]);


    const isNegative = value < 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent/20 rounded-md text-accent">
                        {icon}
                    </div>
                    <div className={cn("text-2xl font-bold", isNegative ? 'text-destructive' : 'text-primary')}>
                        {formatValue(displayValue, format)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
