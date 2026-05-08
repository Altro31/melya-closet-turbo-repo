"use client";

import { deleteBaleAction } from "@/lib/collections";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Bale } from "@/types/bale";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { toast } from "sonner";

interface DeleteBalePayload {
  bale: Bale;
}

export const deleteBaleDialog =
  DialogPrimitive.createHandle<DeleteBalePayload>();

export function DeleteBaleDialog() {
  return (
    <Dialog handle={deleteBaleDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { bale } = payload as DeleteBalePayload;

        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Lote</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar{" "}
                <span className="font-semibold">{bale.name}</span>? Esta acción
                no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose render={<Button variant="outline" />}>
                Cancelar
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteBaleAction(bale.id);
                  toast.success("Lote eliminado correctamente");
                  deleteBaleDialog.close();
                }}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}
