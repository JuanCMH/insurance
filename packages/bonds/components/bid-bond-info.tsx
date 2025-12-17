import Bond from "./bond";
import { BondDataType } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import { ContractDataType } from "../../quotes/types";
import { getBondTotals } from "@/lib/get-bond-totals";
import ResultsCard from "@/packages/quotes/components/results-card";
import { useCreateQuote } from "@/packages/quotes/api";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/packages/workspaces/hooks/use-workspace-id";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";

interface BidBondDataProps {
  contractData: ContractDataType;
  bidBondData: BondDataType;
  resetForm: () => void;
  setBidBondData: Dispatch<SetStateAction<BondDataType>>;
}

const BidBondInfo = ({
  contractData,
  bidBondData,
  resetForm,
  setBidBondData,
}: BidBondDataProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate: createQuote, isPending: isCreatingQuote } = useCreateQuote();

  const [expenses, setExpenses] = useState(0);
  const [calculateExpensesTaxes, setCalculateExpensesTaxes] = useState(false);
  const bidBondTotals = getBondTotals(
    bidBondData.insuredValue,
    bidBondData.rate,
    365,
  );

  const handleCreateQuote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createQuote(
      {
        workspaceId,
        quoteType: "bidBond",
        quoteBonds: [
          {
            ...bidBondData,
            startDate: bidBondData.startDate.getTime(),
            endDate: bidBondData.endDate.getTime(),
          },
        ],
        expenses,
        calculateExpensesTaxes,
        contractee: contractData.contractee,
        contracteeId: contractData.contracteeId,
        contractor: contractData.contractor,
        contractorId: contractData.contractorId,
        contractType: contractData.contractType,
        contractValue: contractData.contractValue,
        contractStart: contractData.contractStart.getTime(),
        contractEnd: contractData.contractEnd.getTime(),
      },
      {
        onSuccess: () => {
          resetForm();
          setExpenses(0);
          setCalculateExpensesTaxes(false);
          toast.success("Cotización creada exitosamente");
        },
        onError: () => {
          toast.error("Error al crear la cotización");
        },
      },
    );
  };

  const isValidQuote =
    bidBondData.percentage > 0 &&
    bidBondData.insuredValue > 0 &&
    bidBondData.rate > 0 &&
    differenceInCalendarDays(bidBondData.endDate, bidBondData.startDate) > 0;

  return (
    <form onSubmit={handleCreateQuote}>
      <Bond
        contractData={contractData}
        startDate={bidBondData.startDate}
        endDate={bidBondData.endDate}
        percentage={bidBondData.percentage}
        insuredValue={bidBondData.insuredValue}
        rate={bidBondData.rate}
        setStartDate={(startDate) =>
          setBidBondData((p) => ({ ...p, startDate }))
        }
        setEndDate={(endDate) => setBidBondData((p) => ({ ...p, endDate }))}
        setPercentage={(percentage) =>
          setBidBondData((p) => ({ ...p, percentage }))
        }
        setInsuredValue={(insuredValue) =>
          setBidBondData((p) => ({ ...p, insuredValue }))
        }
        setRate={(rate) => setBidBondData((p) => ({ ...p, rate }))}
      />
      <ResultsCard
        expenses={expenses}
        setExpenses={setExpenses}
        vat={bidBondTotals.vat}
        total={bidBondTotals.total}
        premium={bidBondTotals.premium}
        calculateExpensesTaxes={calculateExpensesTaxes}
        setCalculateExpensesTaxes={setCalculateExpensesTaxes}
      />
      <footer className="flex justify-end mt-4">
        <Button type="submit" disabled={isCreatingQuote || !isValidQuote}>
          Crear Cotización
        </Button>
      </footer>
    </form>
  );
};

export default BidBondInfo;
