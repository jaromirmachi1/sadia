"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { deleteUnitAction } from "@/app/admin/actions";
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

type DeleteUnitButtonProps = {
  unitId: string;
  label: string;
};

export function DeleteUnitButton({ unitId, label }: DeleteUnitButtonProps) {
  const t = useTranslations("Admin");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteUnitAction(unitId);
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
        className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
      >
        {t("actions.delete")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete.unitTitle", { name: label })}</DialogTitle>
          <DialogDescription>{t("delete.unitConfirm")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger className={buttonVariants({ variant: "outline" })}>
            {t("actions.cancel")}
          </DialogTrigger>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? t("actions.deleting") : t("delete.unitSubmit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
