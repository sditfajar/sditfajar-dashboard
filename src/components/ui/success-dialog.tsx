"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-sm mx-auto p-4 md:p-6 text-center max-h-[85vh] overflow-y-auto">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={() => {
              if (onAction) {
                onAction();
              } else {
                onOpenChange(false);
              }
            }} 
            className="min-w-[120px]"
          >
            {actionLabel || "OK, Mengerti"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
