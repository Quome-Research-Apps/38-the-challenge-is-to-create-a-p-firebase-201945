// src/ai/flows/comparable-property-analysis.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing comparable properties.
 *
 * It takes a property address as input and uses GenAI to find comparable properties
 * and extract relevant financial data for the DealVision model.
 *
 * @interface ComparablePropertyAnalysisInput - The input type for the comparable property analysis flow.
 * @interface ComparablePropertyAnalysisOutput - The output type for the comparable property analysis flow.
 * @function comparablePropertyAnalysis - The main function to trigger the comparable property analysis flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComparablePropertyAnalysisInputSchema = z.object({
  propertyAddress: z
    .string()
    .describe('The address of the property to find comparable properties for.'),
});

export type ComparablePropertyAnalysisInput = z.infer<
  typeof ComparablePropertyAnalysisInputSchema
>;

const ComparablePropertyAnalysisOutputSchema = z.object({
  comparableProperties: z.array(
    z.object({
      address: z.string().describe('The address of the comparable property.'),
      rent: z.number().describe('The monthly rent of the comparable property.'),
      salePrice: z
        .number()
        .describe('The sale price of the comparable property.'),
      squareFootage: z
        .number()
        .describe('The square footage of the comparable property.'),
    })
  ),
});

export type ComparablePropertyAnalysisOutput = z.infer<
  typeof ComparablePropertyAnalysisOutputSchema
>;

export async function comparablePropertyAnalysis(
  input: ComparablePropertyAnalysisInput
): Promise<ComparablePropertyAnalysisOutput> {
  return comparablePropertyAnalysisFlow(input);
}

const comparablePropertyAnalysisPrompt = ai.definePrompt({
  name: 'comparablePropertyAnalysisPrompt',
  input: {schema: ComparablePropertyAnalysisInputSchema},
  output: {schema: ComparablePropertyAnalysisOutputSchema},
  prompt: `You are an expert real estate analyst. Your task is to find comparable properties for a given property address and extract relevant financial data.

  Given the following property address: {{{propertyAddress}}}

  Find at least three comparable properties and extract the following information for each:
  - Address
  - Rent (monthly)
  - Sale Price
  - Square Footage

  Return the data in JSON format.
  `,
});

const comparablePropertyAnalysisFlow = ai.defineFlow(
  {
    name: 'comparablePropertyAnalysisFlow',
    inputSchema: ComparablePropertyAnalysisInputSchema,
    outputSchema: ComparablePropertyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await comparablePropertyAnalysisPrompt(input);
    return output!;
  }
);
