"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { FileText, UserRound } from "lucide-react";
import type { useUserLogs } from "@/sections/user-logs/hooks/use-user-logs";

type UserLogRow = ReturnType<typeof useUserLogs>["data"][number];

interface UserLogDetailsPayload {
  userLog: UserLogRow;
}

export const userLogDetailsDialog =
  DialogPrimitive.createHandle<UserLogDetailsPayload>();

export function UserLogDetailsDialog() {
  return (
    <Dialog handle={userLogDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { userLog } = payload as UserLogDetailsPayload;

        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                {userLog.action}
              </DialogTitle>
              <DialogDescription>{userLog.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Usuario</p>
                <p className="font-medium flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {userLog.User?.name || "Sin usuario"}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Detalle</p>
                <p className="font-medium flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  {userLog.details}
                </p>
              </div>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

