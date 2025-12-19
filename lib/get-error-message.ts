import { ConvexError } from "convex/values";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return (error.data as string) || "Ocurrió un error inesperado";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
}
