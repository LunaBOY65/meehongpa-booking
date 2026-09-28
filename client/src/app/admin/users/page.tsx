"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "@/services/user.service";
import { UserTable } from "@/components/users/UserTable";
import { UserEditModal } from "@/components/users/UserEditModal";
import { UserDeleteDialog } from "@/components/users/UserDeleteDialog";
import type { User, UserRole, UpdateUserRequest } from "@/types";

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
      else setError("Failed to fetch users");
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
        <h1 className="text-2xl font-bold text-gray-800">👥 User Directory Management</h1>
        <p className="text-sm text-gray-500">Manage user accounts, assign roles, reset no-show counters, and unlock accounts</p>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading users...</div>
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
