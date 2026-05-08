import { FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface Props extends React.ComponentProps<typeof FieldLabel> {}

export default function SearchInput({ ...props }: Props) {
  return (
    <InputGroup>
      <InputGroupInput type="search" placeholder="Buscar..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
