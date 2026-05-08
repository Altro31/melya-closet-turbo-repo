import { cn } from "@/lib/utils";

export function Page({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main {...props} className={cn("p-4 md:p-6 lg:p-8", className)}>
      {children}
    </main>
  );
}

export function PageHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("mb-6", className)} {...props}>
      {children}
    </div>
  );
}

export function PageTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-2xl font-serif font-bold text-foreground md:text-3xl"
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
export function PageDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function PageFooter({
  children,
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer className={cn("", className)} {...props}>
      {children}
    </footer>
  );
}
