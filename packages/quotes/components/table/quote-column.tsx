import { formatCop } from "@/lib/format-cop";
import { QuoteActions } from "./quote-actions";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { fullDate, fullDateTime } from "@/lib/date-formats";
import { Doc } from "@/convex/_generated/dataModel";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiInformation2Fill,
  RiMore2Line,
} from "@remixicon/react";
import { QuotePopover } from "./quote-popover";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Doc<"quotes">>[] = [
  {
    accessorKey: "info",
    // meta: {
    //   className: "md:hidden",
    // },
    header: () => {
      return <p className="line-clamp-1 ml-2">Más</p>;
    },
    cell: ({ row }) => {
      const quote = row.original;

      return (
        <QuotePopover quote={quote}>
          <Button variant="ghost" size="icon-sm">
            <RiInformation2Fill className="size-4" />
          </Button>
        </QuotePopover>
      );
    },
  },
  {
    accessorKey: "_creationTime",
    meta: {
      className: "hidden sm:table-cell",
    },
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("_creationTime"));
      return <p className="line-clamp-1 ml-2">{fullDateTime(date)}</p>;
    },
  },
  {
    accessorKey: "quoteType",
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo de Cotización
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const quoteType = row.getValue("quoteType");
      const value = quoteType === "bidBond" ? "Seriedad" : "Cumplimiento";
      return <Badge>{value}</Badge>;
    },
  },
  {
    accessorKey: "contractType",
    meta: {
      className: "hidden lg:table-cell",
    },
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo de Contrato
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="line-clamp-1 ml-2">{row.getValue("contractType")}</p>
      );
    },
  },
  {
    accessorKey: "contractor",
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contratista
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="line-clamp-1 ml-2">{row.getValue("contractor")}</p>;
    },
  },
  {
    accessorKey: "contractStart",
    meta: {
      className: "hidden lg:table-cell",
    },
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inicio del Contrato
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const contractStart = row.original.contractStart;
      return (
        <p className="line-clamp-1 ml-2">{fullDate(new Date(contractStart))}</p>
      );
    },
  },
  {
    accessorKey: "contractEnd",
    meta: {
      className: "hidden lg:table-cell",
    },
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fin del Contrato
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const contractEnd = row.original.contractEnd;
      return (
        <p className="line-clamp-1 ml-2">{fullDate(new Date(contractEnd))}</p>
      );
    },
  },
  {
    accessorKey: "contractValue",
    meta: {
      className: "hidden md:table-cell",
    },
    header: ({ column }) => {
      return (
        <Button
          size="sm"
          variant="ghost"
          className="has-[>svg]:px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor del Contrato
          {column.getIsSorted() === "asc" ? (
            <RiArrowUpLine className="size-4 ml-2" />
          ) : (
            <RiArrowDownLine className="size-4 ml-2" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const contractValue = row.getValue("contractValue");
      const value = Number(contractValue);

      return <p className="line-clamp-1 ml-2">{formatCop(value)}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const quote = row.original;
      const id = row.original._id;

      return (
        <QuoteActions id={id} quote={quote}>
          <Button variant="ghost" size="icon-sm">
            <RiMore2Line className="size-4" />
          </Button>
        </QuoteActions>
      );
    },
  },
];
