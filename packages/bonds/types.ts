import { Id } from "@/convex/_generated/dataModel";

export type BondDataType = {
  id?: Id<"bonds">;
  name: string;
  startDate: Date;
  endDate: Date;
  expiryDate?: Date;
  percentage: number;
  insuredValue: number;
  rate: number;
};
