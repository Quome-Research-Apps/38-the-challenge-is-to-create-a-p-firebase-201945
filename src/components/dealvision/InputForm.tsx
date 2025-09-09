"use client";

import type { UseFormReturn } from 'react-hook-form';
import type { DealInput } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Landmark, Bank, Home, Percent, TrendingUp, Wallet, HandCoins } from "lucide-react";

interface InputFormProps {
  form: UseFormReturn<DealInput>;
}

const inputFields: { name: keyof DealInput, label: string, icon?: React.ReactNode, isPercentage?: boolean, isDollars?: boolean, placeholder?: string }[] = [
    { name: 'purchasePrice', label: 'Purchase Price', isDollars: true, placeholder: '500,000' },
    { name: 'closingCostsPercentage', label: 'Closing Costs', isPercentage: true, placeholder: '3' },
    { name: 'downPaymentPercentage', label: 'Down Payment', isPercentage: true, placeholder: '20' },
    { name: 'interestRate', label: 'Interest Rate', isPercentage: true, placeholder: '6.5' },
    { name: 'loanTerm', label: 'Loan Term (Years)', placeholder: '30' },
    { name: 'grossMonthlyRent', label: 'Gross Monthly Rent', isDollars: true, placeholder: '4,000' },
    { name: 'otherMonthlyIncome', label: 'Other Monthly Income', isDollars: true, placeholder: '0' },
    { name: 'propertyTaxes', label: 'Property Taxes (Annual)', isDollars: true, placeholder: '6,000' },
    { name: 'insurance', label: 'Insurance (Annual)', isDollars: true, placeholder: '1,500' },
    { name: 'propertyManagementPercentage', label: 'Property Management', isPercentage: true, placeholder: '8' },
    { name: 'maintenancePercentage', label: 'Maintenance', isPercentage: true, placeholder: '5' },
    { name: 'capexPercentage', label: 'Capital Expenditures (CapEx)', isPercentage: true, placeholder: '5' },
    { name: 'otherExpenses', label: 'Other Expenses (Annual)', isDollars: true, placeholder: '1,200' },
    { name: 'vacancyPercentage', label: 'Vacancy Rate', isPercentage: true, placeholder: '5' },
    { name: 'rentGrowthPercentage', label: 'Annual Rent Growth', isPercentage: true, placeholder: '3' },
    { name: 'expenseGrowthPercentage', label: 'Annual Expense Growth', isPercentage: true, placeholder: '2' },
    { name: 'appreciationPercentage', label: 'Annual Appreciation', isPercentage: true, placeholder: '4' },
    { name: 'holdingPeriod', label: 'Holding Period (Years)', placeholder: '10' },
];

const NumberInput = ({ field, isPercentage, isDollars, placeholder }: any) => (
  <div className="relative">
    {isDollars && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>}
    <Input
      type="number"
      step="any"
      {...field}
      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
      className={isDollars ? 'pl-7' : isPercentage ? 'pr-7' : ''}
      placeholder={placeholder}
    />
    {isPercentage && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>}
  </div>
);

export function InputForm({ form }: InputFormProps) {
  const renderField = (fieldName: keyof DealInput) => {
    const fieldInfo = inputFields.find(f => f.name === fieldName);
    if (!fieldInfo) return null;

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldInfo.label}</FormLabel>
            <FormControl>
              <NumberInput field={field} {...fieldInfo} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
  
  return (
    <Form {...form}>
      <form className="space-y-4 px-2">
        <Accordion type="multiple" defaultValue={['purchase', 'income', 'expenses', 'assumptions']} className="w-full">
          <AccordionItem value="purchase">
            <AccordionTrigger><div className="flex items-center gap-2"><Landmark className="size-4 text-accent" /> Purchase & Loan</div></AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {renderField('purchasePrice')}
              {renderField('closingCostsPercentage')}
              {renderField('downPaymentPercentage')}
              {renderField('interestRate')}
              {renderField('loanTerm')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="income">
            <AccordionTrigger><div className="flex items-center gap-2"><HandCoins className="size-4 text-accent" /> Income</div></AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {renderField('grossMonthlyRent')}
              {renderField('otherMonthlyIncome')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="expenses">
            <AccordionTrigger><div className="flex items-center gap-2"><Wallet className="size-4 text-accent" /> Expenses</div></AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {renderField('propertyTaxes')}
              {renderField('insurance')}
              {renderField('propertyManagementPercentage')}
              {renderField('maintenancePercentage')}
              {renderField('capexPercentage')}
              {renderField('otherExpenses')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="assumptions">
            <AccordionTrigger><div className="flex items-center gap-2"><TrendingUp className="size-4 text-accent" /> Projections</div></AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
              {renderField('vacancyPercentage')}
              {renderField('rentGrowthPercentage')}
              {renderField('expenseGrowthPercentage')}
              {renderField('appreciationPercentage')}
              {renderField('holdingPeriod')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
