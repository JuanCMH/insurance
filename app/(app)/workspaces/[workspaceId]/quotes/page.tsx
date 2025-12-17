"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetQuotesByWorkspace } from "@/packages/quotes/api";
import { columns } from "@/packages/quotes/components/table/quote-column";
import { useWorkspaceId } from "@/packages/workspaces/hooks/use-workspace-id";
import { QuoteDataTable } from "@/packages/quotes/components/table/quote-data-table";
import { useDates } from "@/lib/useDates";

const QuotePage = () => {
  const workspaceId = useWorkspaceId();

  const [{ selectedYear, selectedMonth }, setDates] = useDates();
  const currentMonthValue = `${selectedYear}-${selectedMonth.padStart(2, "0")}`;

  const { data: quotes, isLoading: isLoadingQuotes } = useGetQuotesByWorkspace({
    workspaceId,
    month: currentMonthValue,
  });

  const handleMonthChange = (monthValue: string) => {
    const [year, month] = monthValue.split("-");
    setDates({ selectedYear: year, selectedMonth: month });
  };

  return (
    <>
      <div className="w-full h-full flex-1 flex flex-col p-2 pl-2 md:pl-0">
        <div className="p-2 border border-muted rounded-lg z-11 bg-card">
          <header className="p-1 border rounded-md z-10 sticky top-0 shrink-0 flex flex-col transition-[width,height] ease-linear">
            <div className="flex items-center w-full">
              <div className="flex gap-2 w-full items-center">
                <SidebarTrigger className="cursor-pointer" />
                <Breadcrumb className="flex">
                  <BreadcrumbList>
                    <BreadcrumbItem>Cotizaciones</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Lista de Cotizaciones</BreadcrumbPage>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </header>
          <main className="mt-2">
            <QuoteDataTable
              columns={columns}
              data={quotes || []}
              onMonthChange={handleMonthChange}
              currentMonthValue={currentMonthValue}
              isLoadingQuotes={isLoadingQuotes}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default QuotePage;
