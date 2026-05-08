import { AddLotDialog } from "@/sections/inventory/components/dialogs/add-bale-dialog";
import { BaleDetailsDialog } from "@/sections/inventory/components/dialogs/bale-details-dialog";
import { DeleteBaleDialog } from "@/sections/inventory/components/dialogs/delete-bale-dialog";
import { EditLotDialog } from "@/sections/inventory/components/dialogs/edit-bale-dialog";

export default function InventoryDialogs() {
  return (
    <>
      <AddLotDialog />
      <BaleDetailsDialog />
      <EditLotDialog />
      <DeleteBaleDialog />
    </>
  );
}
