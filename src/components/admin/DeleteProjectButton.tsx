"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { deleteProjectAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DeleteProjectButtonProps = {
  projectId: string;
  label: string;
  unitCount: number;
};

export function DeleteProjectButton({
  projectId,
  label,
  unitCount,
}: DeleteProjectButtonProps) {
  const t = useTranslations("Admin");
  const [isPending, startTransition] = useTransition();
  const blocked = unitCount > 0;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProjectAction(projectId);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t("actions.deleteFailed"),
        );
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          blocked && "pointer-events-none opacity-50",
        )}
        disabled={blocked}
      >
        {t("actions.delete")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete.projectTitle", { name: label })}</DialogTitle>
          <DialogDescription>
            {blocked ? t("delete.projectBlocked") : t("delete.projectConfirm")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger className={buttonVariants({ variant: "outline" })}>
            {t("actions.cancel")}
          </DialogTrigger>
          <Button
            variant="destructive"
            disabled={isPending || blocked}
            onClick={handleDelete}
          >
            {isPending ? t("actions.deleting") : t("delete.projectSubmit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
