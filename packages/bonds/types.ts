import { Id } from "@/convex/_generated/dataModel";

export type BondDataType = {
  name: string;
  startDate: Date;
  endDate: Date;
  percentage: number;
  insuredValue: number;
  rate: number;
};

export type PerformanceBondDataType = {
  id?: Id<"bonds">;
  name: string;
  startDate: Date;
  endDate: Date;
  percentage: number;
  insuredValue: number;
  rate: number;
};
