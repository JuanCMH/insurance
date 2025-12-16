"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ContractDataType } from "@/packages/quotes/types";
import BidBondInfo from "@/packages/bonds/components/bid-bond-info";
import { RiFileAi2Line, RiShieldCheckFill } from "@remixicon/react";
import ContractInfo from "@/packages/quotes/components/contract-info";
import { BondDataType, PerformanceBondDataType } from "@/packages/bonds/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceBondsInfo from "@/packages/bonds/components/performance-bonds-info";
import { QuoteAgentModal } from "@/packages/quotes/components/modals/quote-agent-modal";

const QuotesPage = () => {
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [quoteType, setQuoteType] = useState<"bidBond" | "performanceBonds">(
    "bidBond",
  );
  const [contractData, setContractData] = useState<ContractDataType>({
    contractor: "",
    contractorId: "",
    contractee: "",
    contracteeId: "",
    contractType: "",
    contractValue: 0,
    contractStart: new Date(),
    contractEnd: new Date(),
  });

  const [bidBondData, setBidBondData] = useState<BondDataType>({
    name: "Seriedad de la oferta",
    startDate: new Date(),
    endDate: new Date(),
    percentage: 0,
    insuredValue: 0,
    rate: 0,
  });

  const [performanceBondsData, setPerformanceBondsData] = useState<
    Array<PerformanceBondDataType>
  >([]);

  const handleQuoteTypeChange = (value: string) => {
    if (value === "bidBond" || value === "performanceBonds") {
      setQuoteType(value);
    }
  };

  return (
    <>
      <div className="w-full h-full flex-1 flex flex-col px-2">
        <div className="p-2 border border-muted rounded-lg mx-2 mt-4 z-11 bg-card pb-2">
          <header className="z-10 sticky top-0 shrink-0 flex flex-col transition-[width,height] ease-linear">
            <div className="flex items-center w-full">
              <div className="flex gap-2 w-full">
                <SidebarTrigger className="cursor-pointer" />
                <Breadcrumb className="flex">
                  <BreadcrumbList>
                    <BreadcrumbItem>Cotizador</BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="cursor-pointer ml-auto"
                  onClick={() => setAgentModalOpen(true)}
                >
                  <RiFileAi2Line className="size-4" />
                </Button>
              </div>
            </div>
          </header>
          <ContractInfo
            contractData={contractData}
            setContractData={setContractData}
          />
        </div>
        <div className="p-2 border border-muted rounded-lg mx-2 mt-4 z-11 bg-card pb-2">
          <Tabs value={quoteType} onValueChange={handleQuoteTypeChange}>
            <header className="flex items-center justify-between gap-2">
              <div className="flex gap-2 items-center">
                <RiShieldCheckFill className="size-4" />
                <h1 className="text-lg font-semibold">Amparos</h1>
              </div>
              <TabsList className="h-8">
                <TabsTrigger value="bidBond">Seriedad</TabsTrigger>
                <TabsTrigger value="performanceBonds">Cumplimiento</TabsTrigger>
              </TabsList>
            </header>
            <Separator />
            <TabsContent value="bidBond">
              <BidBondInfo
                contractData={contractData}
                bidBondData={bidBondData}
                setBidBondData={setBidBondData}
              />
            </TabsContent>
            <TabsContent value="performanceBonds">
              <PerformanceBondsInfo
                contractData={contractData}
                performanceBondsData={performanceBondsData}
                setPerformanceBondsData={setPerformanceBondsData}
                setQuoteType={setQuoteType}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <QuoteAgentModal
        open={agentModalOpen}
        setOpen={setAgentModalOpen}
        setExternalQuoteType={setQuoteType}
        setContractData={setContractData}
        setBidBondData={setBidBondData}
        setPerformanceBondsData={setPerformanceBondsData}
      />
    </>
  );
};

export default QuotesPage;
