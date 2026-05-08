"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { Mail, Phone, UserRound } from "lucide-react";
import type { useUsers } from "@/sections/users/hooks/use-users";

type UserRow = ReturnType<typeof useUsers>["data"][number];

interface UserDetailsPayload {
  user: UserRow;
}

export const userDetailsDialog =
  DialogPrimitive.createHandle<UserDetailsPayload>();

export function UserDetailsDialog() {
  return (
    <Dialog handle={userDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { user } = payload as UserDetailsPayload;

        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">{user.name}</DialogTitle>
              <DialogDescription>{user.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                <p className="font-medium flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {user.name}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
              </div>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

