import { useConfirm } from "@/components/hooks/use-confirm";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useRemoveBond, useUpdateBond } from "../../api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SelectedBondModalProps {
  selectedBond: Doc<"bonds"> | undefined;
  handleCloseSelectedBond: () => void;
}

type BondFormData = {
  name: string;
  description: string;
};

export const SelectedBondModal = ({
  selectedBond,
  handleCloseSelectedBond,
}: SelectedBondModalProps) => {
  const [updateData, setUpdateData] = useState<BondFormData>({
    name: selectedBond ? selectedBond.name : "",
    description: selectedBond ? selectedBond.description : "",
  });

  const handleClose = () => {
    setUpdateData({
      name: "",
      description: "",
    });
    handleCloseSelectedBond();
  };

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Eliminar amparo",
    message: "¿Estás seguro que deseas eliminar este amparo?",
    type: "critical",
  });

  const { mutate: updateBond, isPending: isUpdatingBond } = useUpdateBond();
  const { mutate: removeBond, isPending: isRemovingBond } = useRemoveBond();

  const handleUpdateBond = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBond) return;
    updateBond(
      { ...updateData, id: selectedBond._id },
      {
        onSuccess: () => {
          toast.success("Amparo actualizado correctamente");
          handleClose();
        },
        onError: () => {
          toast.error("Error al actualizar el amparo");
        },
      },
    );
  };

  const handleRemoveBond = async () => {
    if (!selectedBond) return;
    const ok = await confirm();
    if (!ok) return;

    removeBond(
      { id: selectedBond._id },
      {
        onSuccess: () => {
          toast.success("Amparo eliminado correctamente");
          handleClose();
        },
        onError: () => {
          toast.error("Error al eliminar el amparo");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={!!selectedBond} onOpenChange={handleCloseSelectedBond}>
        <DialogContent className="p-0 gap-0">
          <DialogHeader className="p-4">
            <DialogTitle className="capitalize">
              {selectedBond?.name}
            </DialogTitle>
            <DialogDescription>
              Edita la información del amparo seleccionado.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex flex-col p-4 gap-2">
            <form className="space-y-4" onSubmit={handleUpdateBond}>
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="bond-name" className="text-xs">
                  NOMBRE
                </Label>
                <Input
                  required
                  id="bond-name"
                  minLength={4}
                  maxLength={40}
                  value={updateData.name}
                  disabled={isUpdatingBond}
                  placeholder="Amparo de cumplimiento"
                  onChange={(e) =>
                    setUpdateData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="bond-description" className="text-xs">
                  DESCRIPCIÓN
                </Label>
                <Textarea
                  maxLength={200}
                  value={updateData.description}
                  disabled={isUpdatingBond}
                  className="resize-none h-24"
                  placeholder="Descripción opcional del amparo"
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button disabled={isUpdatingBond} type="submit">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
