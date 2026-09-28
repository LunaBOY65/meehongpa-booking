"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "@/services/user.service";
import { UserTable } from "@/components/users/UserTable";
import { UserEditModal } from "@/components/users/UserEditModal";
import { UserDeleteDialog } from "@/components/users/UserDeleteDialog";
import type { User, UpdateUserRequest } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch user directory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSaveUser = async (id: string, data: UpdateUserRequest) => {
    await userService.updateUser(id, data);
    fetchUsers();
  };

  const handleDeleteUser = async (id: string) => {
    await userService.deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Member Directory</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage user roles, resolve no-show policy suspensions, and update member departments</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading user directory...</span>
        </div>
      ) : (
        <UserTable
          users={users}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <UserEditModal
        user={selectedUser}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(id, data) => handleSaveUser(id, data as UpdateUserRequest)}
      />

      <UserDeleteDialog
        user={selectedUser}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
