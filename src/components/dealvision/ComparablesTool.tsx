"use client";

import { useState } from 'react';
import { comparablePropertyAnalysis, type ComparablePropertyAnalysisOutput } from '@/ai/flows/comparable-property-analysis';
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ComparablesTool() {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ComparablePropertyAnalysisOutput | null>(null);
    const { toast } = useToast();
    
    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            toast({ variant: "destructive", title: "Address is required" });
            return;
        }

        setLoading(true);
        setResults(null);
        try {
            const response = await comparablePropertyAnalysis({ propertyAddress: address });
            setResults(response);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "Could not fetch comparable properties. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <div className="p-2 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><BrainCircuit className="size-4 text-accent" /> AI Comparables</h3>
            <form onSubmit={handleAnalyze} className="space-y-2">
                <Input 
                    placeholder="Enter property address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Analyzing...' : 'Find Comps'}
                </Button>
            </form>
            {results && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Comparable Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sale Price</TableHead>
                                    <TableHead>Rent</TableHead>
                                    <TableHead>Sq. Ft.</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.comparableProperties.map((prop, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{currencyFormatter(prop.salePrice)}</TableCell>
                                        <TableCell>{currencyFormatter(prop.rent)}</TableCell>
                                        <TableCell>{prop.squareFootage.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
