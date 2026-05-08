import type { Bale } from "@/types/bale";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useSelectCategories } from "@/sections/inventory/hooks/use-select-categories";
import { useState } from "react";

type Item = Pick<Bale, "id" | "name">;

interface Props {
  value?: Item | null;
  onChange?: (item: Item | null) => void;
}

export default function BaleCategorySelect({ onChange, value }: Props) {
  const [search, setSearch] = useState("");
  const { data: categories } = useSelectCategories({ search });
  return (
    <Combobox<Item>
      value={value}
      items={categories}
      isItemEqualToValue={(a, b) => a.id === b.id}
      onInputValueChange={setSearch}
      onValueChange={(item) => {
        setSearch("");
        onChange?.(item);
      }}
      itemToStringLabel={(i) => i.name}
    >
      <ComboboxInput showClear />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Item) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
