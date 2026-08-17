import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-gutter", className)} {...props} />
  );
}
