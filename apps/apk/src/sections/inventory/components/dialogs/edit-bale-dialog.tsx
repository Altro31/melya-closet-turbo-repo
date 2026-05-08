"use client";

import { updateBaleAction } from "@/lib/collections";
import {
  Form,
  FormActions,
  FormContent,
  FormFields,
  FormSubmit,
} from "@/components/buzzform/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelectCategories } from "@/sections/inventory/hooks/use-select-categories";
import type { Bale } from "@/types/bale";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { defineSchema, type InferType } from "@buildnbuzz/form-core";
import { PenSquareIcon } from "lucide-react";

interface EditBalePayload {
  bale: Bale;
}

export const editBaleDialog = DialogPrimitive.createHandle<EditBalePayload>();

export function EditLotDialog() {
  return (
    <Dialog handle={editBaleDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { bale } = payload as EditBalePayload;
        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                Editar Lote
              </DialogTitle>
              <DialogDescription>
                Modifica los detalles del lote {bale.id}. Los campos marcados
                con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <EditBaleForm bale={bale} />
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

function EditBaleForm({ bale }: { bale: Bale }) {
  const { data } = useSelectCategories();
  type FormData = InferType<typeof formSchema.fields>;
  const formSchema = defineSchema({
    fields: [
      {
        type: "text",
        name: "name",
        label: "Nombre de la paca",
        placeholder: "Ej: Ajuares",
        defaultValue: bale.name,
        trim: true,
      },
      {
        type: "select",
        name: "categoryId",
        label: "Categoría",
        options: data.map((c) => ({ label: c.name, value: c.id })),
        ui: {
          isSearchable: true,
          isClearable: true,
        },
        placeholder: "Ej: Pantalones, ajuares,...",
        // hasMany: true,
        minSelected: 1,
        defaultValue: bale.categoryId,
      },
      {
        type: "row",
        ui: {
          wrap: false,
          responsive: false,
        },
        fields: [
          {
            type: "number",
            name: "initialTotal",
            label: "Cantidad inicial de piezas",
            ui: {
              step: 5,
            },
            min: 1,
            precision: 0,
            placeholder: "Ej: 200",
            defaultValue: bale.initialTotal,
          },
          {
            type: "number",
            name: "currentTotal",
            label: "Cantidad actual de piezas",
            ui: {
              step: 1,
            },
            defaultValue: bale.currentTotal,
            min: 0,
            precision: 0,
          },
        ],
      },
      {
        type: "row",
        ui: {
          wrap: false,
          responsive: false,
        },
        fields: [
          {
            type: "number",
            name: "price",
            label: "Precio de la paca",
            style: {
              width: "50%",
            },
            ui: {
              step: 5,
              prefix: "$",
            },
            placeholder: "Ej: 100",
            min: 1,
            precision: 0,
            defaultValue: bale.price,
          },
          {
            type: "number",
            name: "merma",
            label: "Piezas dañadas",
            ui: {
              step: 1,
            },
            defaultValue: bale.merma,
            min: 0,
            precision: 0,
          },
        ],
      },

      {
        type: "textarea",
        name: "description",
        label: "Descripción",
        rows: 2,
        autoResize: true,
        defaultValue: bale.description ?? undefined,
      },
    ],
  });
  return (
    <Form
      schema={formSchema}
      onSubmit={async ({ value }) => {
        const data = value as FormData;
        updateBaleAction([bale.id, data]);
        editBaleDialog.close();
      }}
    >
      <FormContent>
        <FormFields />
        <FormActions>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <FormSubmit>
            <PenSquareIcon /> Actualizar
          </FormSubmit>
        </FormActions>
      </FormContent>
    </Form>
  );
}
