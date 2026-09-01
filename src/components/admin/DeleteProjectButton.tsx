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

type DeleteProjectButtonProps = {
  projectId: string;
  label: string;
};

export function DeleteProjectButton({ projectId, label }: DeleteProjectButtonProps) {
  const t = useTranslations("Admin");
  const [isPending, startTransition] = useTransition();

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
      <DialogTrigger className={buttonVariants({ variant: "destructive", size: "sm" })}>
        {t("actions.delete")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete.projectTitle", { name: label })}</DialogTitle>
          <DialogDescription>{t("delete.projectConfirm")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger className={buttonVariants({ variant: "outline" })}>
            {t("actions.cancel")}
          </DialogTrigger>
          <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
            {isPending ? t("actions.deleting") : t("delete.projectSubmit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
