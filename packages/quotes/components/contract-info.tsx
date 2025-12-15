import { CurrencyInput } from "@/components/currency-input";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ContractDataType } from "../types";
import { Dispatch, SetStateAction } from "react";
import { isAfter, isBefore } from "date-fns";
import { RiContractFill } from "@remixicon/react";

interface ContractInfoProps {
  contractData: ContractDataType;
  setContractData: Dispatch<SetStateAction<ContractDataType>>;
}

const ContractInfo = ({ contractData, setContractData }: ContractInfoProps) => {
  const handleStartDateChange = (date: Date) => {
    if (isAfter(date, contractData.contractEnd)) return;
    setContractData((prev) => ({ ...prev, contractStart: date }));
  };

  const handleEndDateChange = (date: Date) => {
    if (isBefore(date, contractData.contractStart)) return;
    setContractData((prev) => ({ ...prev, contractEnd: date }));
  };

  const handleContractValueChange = (value: string) => {
    setContractData((prev) => ({
      ...prev,
      contractValue: value === "" ? 0 : Number(value),
    }));
  };

  return (
    <main className="mt-2">
      <div className="flex gap-2 items-center">
        <RiContractFill className="size-4" />
        <h1 className="text-lg font-semibold">
          Información básica del contrato
        </h1>
      </div>
      <Separator className="my-2" />
      <div className="mt-2 grid grid-cols-4 gap-2">
        <div className="grid w-full items-center gap-1 col-span-3">
          <Label htmlFor="contractor" className="text-xs">
            AFIANZADO/CONTRATISTA
          </Label>
          <Input
            id="contractor"
            placeholder="Luis Salamanca"
            value={contractData.contractor}
            onChange={(e) =>
              setContractData((prev) => ({
                ...prev,
                contractor: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contractor-id" className="text-xs">
            NIT
          </Label>
          <Input
            id="contractor-id"
            placeholder="9012345678"
            value={contractData.contractorId}
            onChange={(e) =>
              setContractData((prev) => ({
                ...prev,
                contractorId: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-1 col-span-3">
          <Label htmlFor="contractee" className="text-xs">
            ASEGURADO-BENEFICIARIO/CONTRATANTE
          </Label>
          <Input
            id="contractee"
            placeholder="Juan Pérez"
            value={contractData.contractee}
            onChange={(e) =>
              setContractData((prev) => ({
                ...prev,
                contractee: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contractee-id" className="text-xs">
            NIT
          </Label>
          <Input
            id="contractee-id"
            placeholder="8765432109"
            value={contractData.contracteeId}
            onChange={(e) =>
              setContractData((prev) => ({
                ...prev,
                contracteeId: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contract-type" className="text-xs">
            TIPO DE CONTRATO
          </Label>
          <Input
            id="contract-type"
            placeholder="Prestación de servicios"
            value={contractData.contractType}
            onChange={(e) =>
              setContractData((prev) => ({
                ...prev,
                contractType: e.target.value,
              }))
            }
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contract-value" className="text-xs">
            VALOR DEL CONTRATO
          </Label>
          <CurrencyInput
            placeholder="$200.000.000"
            value={
              contractData.contractValue
                ? String(contractData.contractValue)
                : ""
            }
            onChange={handleContractValueChange}
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contract-start" className="text-xs">
            INICIO
          </Label>
          <DatePicker
            date={contractData.contractStart}
            onSelect={(date) => date && handleStartDateChange(date)}
          />
        </div>
        <div className="grid w-full items-center gap-1">
          <Label htmlFor="contract-end" className="text-xs">
            FINALIZACIÓN
          </Label>
          <DatePicker
            date={contractData.contractEnd}
            onSelect={(date) => date && handleEndDateChange(date)}
          />
        </div>
      </div>
    </main>
  );
};

export default ContractInfo;
