"use client";

import { createBaleAction } from "@/lib/collections";
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
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { defineSchema, InferType } from "@buildnbuzz/form-core";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const addBaleDialog = DialogPrimitive.createHandle();

export function AddLotDialog() {
  const { data } = useSelectCategories();
  type FormData = InferType<typeof formSchema.fields>;
  const formSchema = defineSchema({
    fields: [
      {
        type: "text",
        name: "name",
        label: "Nombre de la paca",
        placeholder: "Ej: Ajuares",
        required: true,
        defaultValue: "",
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
        required: true,
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
            label: "Cantidad de piezas",
            ui: {
              step: 5,
            },
            required: true,
            min: 1,
            precision: 0,
            placeholder: "Ej: 200",
            defaultValue: 0,
          },
          {
            type: "number",
            name: "merma",
            label: "Piezas dañadas",
            ui: {
              step: 1,
            },
            defaultValue: 0,
            min: 0,
            precision: 0,
          },
        ],
      },
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
        required: true,
        defaultValue: 0,
      },
      {
        type: "textarea",
        name: "description",
        label: "Descripción",
        rows: 2,
        autoResize: true,
      },
    ],
  });
  return (
    <Dialog handle={addBaleDialog}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Nuevo Lote</DialogTitle>
          <DialogDescription>
            Completa los detalles del lote. Los campos marcados con * son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form
          schema={formSchema}
          onSubmit={async ({ value }) => {
            const data = value as FormData;
            createBaleAction({
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              currentTotal: data.initialTotal,
              status: "activa",
              merma: data.merma ?? 0,
            });
            toast.success("Message sent!");
            addBaleDialog.close();
          }}
        >
          <FormContent>
            <FormFields />
            <div>
              <FormActions>
                <DialogClose render={<Button variant="outline" />}>
                  Cancelar
                </DialogClose>
                <FormSubmit>
                  <Save /> Crear
                </FormSubmit>
              </FormActions>
            </div>
          </FormContent>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
