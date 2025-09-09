"use client"

import type { DealInput, DealOutput } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartTooltipContent } from "@/components/ui/chart";

interface ChartsSectionProps {
    output: DealOutput;
    inputs: DealInput;
}

const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

export function ChartsSection({ output, inputs }: ChartsSectionProps) {
    const expenseData = [
        { name: 'Taxes', value: inputs.propertyTaxes },
        { name: 'Insurance', value: inputs.insurance },
        { name: 'Management', value: output.effectiveGrossIncome * (inputs.propertyManagementPercentage / 100) },
        { name: 'Maintenance', value: output.effectiveGrossIncome * (inputs.maintenancePercentage / 100) },
        { name: 'Other', value: inputs.otherExpenses },
    ].filter(d => d.value > 0);

    const COLORS = ['#468189', '#2E3192', '#7A8B99', '#9DB4C0', '#5C6B73'];
    
    return (
        <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Cash Flow Projection</CardTitle>
                    <CardDescription>Annual cash flow over the {inputs.holdingPeriod}-year holding period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={output.yearlyProjections}>
                            <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Yr ${value}`} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={currencyFormatter} />
                            <Tooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter(value as number)}/>} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }} />
                            <Bar dataKey="cashFlow" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Annual Expense Breakdown</CardTitle>
                    <CardDescription>Distribution of first-year operating expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                return (percent > 0.05) ? <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text> : null;
                            }}>
                                {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent formatter={(value) => currencyFormatter(value as number)}/>} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
