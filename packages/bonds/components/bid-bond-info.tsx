import Bond from "./bond";
import { BondDataType } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import { ContractDataType } from "../../quotes/types";
import { getBondTotals } from "@/lib/get-bond-totals";
import ResultsCard from "@/packages/quotes/components/results-card";

interface BidBondDataProps {
  contractData: ContractDataType;
  bidBondData: BondDataType;
  setBidBondData: Dispatch<SetStateAction<BondDataType>>;
}

const BidBondInfo = ({
  contractData,
  bidBondData,
  setBidBondData,
}: BidBondDataProps) => {
  const [expenses, setExpenses] = useState(0);
  const [calculateExpensesTaxes, setCalculateExpensesTaxes] = useState(false);
  const bidBondTotals = getBondTotals(
    bidBondData.insuredValue,
    bidBondData.rate,
    365,
  );

  return (
    <>
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
    </>
  );
};

export default BidBondInfo;
