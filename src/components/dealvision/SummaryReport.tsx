"use client"

import type { DealInput, DealOutput } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface SummaryReportProps {
  output: DealOutput;
  inputs: DealInput;
}

const SummaryRow = ({ label, value, isHeader = false }: { label: string; value: string | number; isHeader?: boolean }) => (
    <TableRow>
        <TableCell className={isHeader ? "font-bold text-base" : "text-muted-foreground"}>{label}</TableCell>
        <TableCell className={`text-right font-medium ${isHeader ? "font-bold text-base" : ""}`}>{value}</TableCell>
    </TableRow>
);

const formatCurrency = (val: number) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const formatPercent = (val: number) => `${val.toFixed(2)}%`;
const formatNumber = (val: number) => val.toLocaleString();


export function SummaryReport({ output, inputs }: SummaryReportProps) {
    return (
        <Card className="mt-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-primary">DealVision Analysis Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <section>
                    <h3 className="font-semibold text-lg mb-2 text-primary">Key Performance Indicators</h3>
                    <Table>
                        <TableBody>
                            <SummaryRow label="Net Operating Income" value={formatCurrency(output.noi)} />
                            <SummaryRow label="Capitalization Rate" value={formatPercent(output.capRate)} />
                            <SummaryRow label="Annual Cash Flow" value={formatCurrency(output.cashFlow)} />
                            <SummaryRow label="Cash on Cash Return" value={formatPercent(output.cashOnCashReturn)} />
                        </TableBody>
                    </Table>
                </section>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                    <section>
                        <h3 className="font-semibold text-lg mb-2 text-primary">Purchase & Loan</h3>
                        <Table>
                            <TableBody>
                                <SummaryRow label="Purchase Price" value={formatCurrency(inputs.purchasePrice)} />
                                <SummaryRow label="Down Payment" value={`${formatCurrency(output.downPayment)} (${inputs.downPaymentPercentage}%)`} />
                                <SummaryRow label="Loan Amount" value={formatCurrency(output.loanAmount)} />
                                <SummaryRow label="Total Cash Needed" value={formatCurrency(output.totalCashNeeded)} />
                                <SummaryRow label="Monthly Mortgage" value={formatCurrency(output.monthlyMortgage)} />
                            </TableBody>
                        </Table>
                    </section>
                    <section>
                        <h3 className="font-semibold text-lg mb-2 text-primary">Income & Expenses (Year 1)</h3>
                        <Table>
                            <TableBody>
                                <SummaryRow label="Effective Gross Income" value={formatCurrency(output.effectiveGrossIncome)} />
                                <SummaryRow label="Operating Expenses" value={formatCurrency(output.annualOperatingExpenses)} />
                                <SummaryRow label="Vacancy" value={`${formatCurrency(output.effectiveGrossIncome / (1-inputs.vacancyPercentage/100) * (inputs.vacancyPercentage/100))} (${inputs.vacancyPercentage}%)`}/>
                            </TableBody>
                        </Table>
                    </section>
                </div>
                <Separator />
                <section>
                    <h3 className="font-semibold text-lg mb-2 text-primary">{inputs.holdingPeriod}-Year Projection Summary</h3>
                     <Table>
                        <TableBody>
                           <SummaryRow label="Total Profit at Sale" value={formatCurrency(output.totalProfit)} />
                           <SummaryRow label="Total Return on Equity" value={formatPercent(output.totalReturnOnEquity)} />
                        </TableBody>
                    </Table>
                </section>
            </CardContent>
        </Card>
    );
}
