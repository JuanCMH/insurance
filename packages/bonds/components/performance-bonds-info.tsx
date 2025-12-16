import { Dispatch, SetStateAction, useState } from "react";
import { ContractDataType } from "../../quotes/types";
import { BondPicker } from "@/components/bond-picker";
import { RiListCheck3, RiMore2Line, RiShieldCheckFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BondsModal } from "@/packages/bonds/components/modal/bonds-modal";
import { Id } from "@/convex/_generated/dataModel";
import { PerformanceBondDataType } from "@/packages/bonds/types";
import Bond from "./bond";
import { PerformanceBondsList } from "./performance-bonds-list";
import ResultsCard from "@/packages/quotes/components/results-card";
import { getBondTotals } from "@/lib/get-bond-totals";
import { differenceInCalendarDays } from "date-fns";
import { getQuoteTotals } from "@/lib/get-quote-totals";

interface PerformanceBondsInfoProps {
  contractData: ContractDataType;
  performanceBondsData: Array<PerformanceBondDataType>;
  setPerformanceBondsData: Dispatch<
    SetStateAction<Array<PerformanceBondDataType>>
  >;
  setQuoteType: Dispatch<SetStateAction<"bidBond" | "performanceBonds">>;
}

const PerformanceBondsInfo = ({
  contractData,
  performanceBondsData,
  setQuoteType,
  setPerformanceBondsData,
}: PerformanceBondsInfoProps) => {
  const [expenses, setExpenses] = useState(0);
  const [calculateExpensesTaxes, setCalculateExpensesTaxes] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [bodsModalOpen, setBondsModalOpen] = useState(false);
  const [selectedBondId, setSelectedBondId] = useState<Id<"bonds"> | undefined>(
    undefined,
  );

  const selectedBond = performanceBondsData.find(
    (b) => b.id === selectedBondId,
  );

  const performanceBondTotals = getBondTotals(
    selectedBond?.insuredValue || 0,
    selectedBond?.rate || 0,
    differenceInCalendarDays(
      selectedBond?.endDate || new Date(),
      selectedBond?.startDate || new Date(),
    ),
  );

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
    <>
      <div className="space-y-4">
        <div className="flex gap-2">
          <BondPicker
            value={selectedBondId}
            onChange={setSelectedBondId}
            bonds={performanceBondsData}
            placeholder="Seleccionar amparo"
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <RiMore2Line />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setBondsModalOpen(true)}
              >
                <RiShieldCheckFill />
                Amparos
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setListOpen(true)}
                disabled={performanceBondsData.length === 0}
              >
                <RiListCheck3 />
                Amparos agregados{` (${performanceBondsData.length})`}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {selectedBond && (
          <>
            <Bond
              key={selectedBond.id}
              contractData={contractData}
              startDate={selectedBond.startDate}
              endDate={selectedBond.endDate}
              percentage={selectedBond.percentage}
              insuredValue={selectedBond.insuredValue}
              rate={selectedBond.rate}
              setStartDate={(startDate) => {
                setPerformanceBondsData((prev) =>
                  prev.map((b) =>
                    b.id === selectedBond.id ? { ...b, startDate } : b,
                  ),
                );
              }}
              setEndDate={(endDate) => {
                setPerformanceBondsData((prev) =>
                  prev.map((b) =>
                    b.id === selectedBond.id ? { ...b, endDate } : b,
                  ),
                );
              }}
              setPercentage={(percentage) => {
                setPerformanceBondsData((prev) =>
                  prev.map((b) =>
                    b.id === selectedBond.id ? { ...b, percentage } : b,
                  ),
                );
              }}
              setInsuredValue={(insuredValue) => {
                setPerformanceBondsData((prev) =>
                  prev.map((b) =>
                    b.id === selectedBond.id ? { ...b, insuredValue } : b,
                  ),
                );
              }}
              setRate={(rate) => {
                setPerformanceBondsData((prev) =>
                  prev.map((b) =>
                    b.id === selectedBond.id ? { ...b, rate } : b,
                  ),
                );
              }}
            />
            <ResultsCard
              vat={performanceBondTotals.vat}
              total={performanceBondTotals.total}
              premium={performanceBondTotals.premium}
            />
          </>
        )}
        {!selectedBond && (
          <ResultsCard
            vat={results.vat}
            total={results.total}
            premium={results.premium}
            expenses={expenses}
            setExpenses={setExpenses}
            calculateExpensesTaxes={calculateExpensesTaxes}
            setCalculateExpensesTaxes={setCalculateExpensesTaxes}
          />
        )}
        <PerformanceBondsList
          open={listOpen}
          setOpen={setListOpen}
          expenses={expenses}
          setExpenses={setExpenses}
          setQuoteType={setQuoteType}
          setSelectedBondId={setSelectedBondId}
          performanceBondsData={performanceBondsData}
          calculateExpensesTaxes={calculateExpensesTaxes}
          setCalculateExpensesTaxes={setCalculateExpensesTaxes}
        />
      </div>
      <BondsModal
        open={bodsModalOpen}
        setOpen={setBondsModalOpen}
        contractData={contractData}
        performanceBondsData={performanceBondsData}
        setPerformanceBondsData={setPerformanceBondsData}
      />
    </>
  );
};

export default PerformanceBondsInfo;
