import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function isLocalRow(row: { $synced?: boolean }) {
  return row.$synced === false;
}

export function LocalRowBadge({
  isLocal,
  className,
}: {
  isLocal: boolean;
  className?: string;
}) {
  if (!isLocal) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={cn("border-amber-200 bg-amber-50 text-amber-700", className)}
    >
      Local
    </Badge>
  );
}
