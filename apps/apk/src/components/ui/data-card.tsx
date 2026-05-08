import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DataCardGroud({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid gap-2 grid-cols-2 xs:grid-cols-3 sm:gap-4",
        className
      )}
      {...props}
    />
  );
}

export function DataCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return <Card {...props} className={cn("gap-1 max-sm:p-1", className)} />;
}

export function DataCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return (
    <CardHeader
      className={cn(
        "flex flex-row items-center justify-between max-sm:px-2",
        className
      )}
      {...props}
    />
  );
}

export function DataCardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      className={cn("sm:text-sm font-medium text-muted-foreground ", className)}
      {...props}
    />
  );
}

export function DataCardMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-8 rounded-xl bg-primary/10 flex items-center justify-center *:size-4.5",
        className
      )}
      {...props}
    />
  );
}

export function DataCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  return <CardContent {...props} className={cn("max-sm:px-2", className)} />;
}

export function DataCardValue({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-3xl font-bold text-foreground", className)}
      {...props}
    />
  );
}

export function DataCardValueDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("max-sm:hidden text-xs text-muted-foreground mt-1")}
      {...props}
    />
  );
}
