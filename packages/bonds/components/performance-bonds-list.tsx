import { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PerformanceBondCard } from "./performance-bond-card";
import { PerformanceBondDataType } from "../types";
import ResultsCard from "@/packages/quotes/components/results-card";
import { getQuoteTotals } from "@/lib/get-quote-totals";
import { differenceInCalendarDays } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface PerformanceBondsListProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  performanceBondsData: Array<PerformanceBondDataType>;
  setQuoteType: Dispatch<SetStateAction<"bidBond" | "performanceBonds">>;
  setSelectedBondId: Dispatch<SetStateAction<Id<"bonds"> | undefined>>;
}

export const PerformanceBondsList = ({
  open,
  setOpen,
  setQuoteType,
  setSelectedBondId,
  performanceBondsData,
}: PerformanceBondsListProps) => {
  const results = getQuoteTotals(
    performanceBondsData.map((data) => {
      return {
        insuredValue: data.insuredValue,
        rate: data.rate,
        days: differenceInCalendarDays(data.endDate, data.startDate),
      };
    }),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="truncate">Lista de Garantías</SheetTitle>
          <SheetDescription>
            En esta sección se muestran las garantías de cumplimiento agregadas
            a la cotización.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <main className="overflow-y-auto space-y-2 px-2 h-full">
          {performanceBondsData.map((bond, index) => (
            <PerformanceBondCard
              key={index}
              bondData={bond}
              setOpen={setOpen}
              setQuoteType={setQuoteType}
              setSelectedBondId={setSelectedBondId}
            />
          ))}
        </main>
        <footer className="p-2">
          <ResultsCard
            vat={results.vat}
            total={results.total}
            premium={results.premium}
          />
        </footer>
      </SheetContent>
    </Sheet>
  );
};
