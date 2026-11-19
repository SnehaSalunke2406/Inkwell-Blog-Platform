
import { useMemo, useState } from "react";

const initialUsers = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    role: "Author",
    status: "Active",
    joined: "2026-10-10",
  },
  {
    id: 2,
    name: "Priya Patil",
    email: "priya@example.com",
    role: "Reader",
    status: "Active",
    joined: "2026-10-15",
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul@example.com",
    role: "Author",
    status: "Inactive",
    joined: "2026-10-20",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    email: "sneha@example.com",
    role: "Reader",
    status: "Active",
    joined: "2026-11-01",
  },
  {
    id: 5,
    name: "Aditya Kulkarni",
    email: "aditya@example.com",
    role: "Admin",
    status: "Active",
    joined: "2026-11-05",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Reader");
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
  const authors = users.filter((u) => u.role === "Author").length;

  function openAdd() {
    setEditing(null);
    setName("");
    setEmail("");
    setRole("Reader");
    setNotice("");
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditing(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setNotice("");
    setModalOpen(true);
  }

  function saveUser(e) {
    e.preventDefault();

    const duplicate = users.some(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.id !== editing?.id
    );

    if (duplicate) {
      setNotice("This email address is already registered.");
      return;
    }

    if (editing) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editing.id
            ? { ...user, name: name.trim(), email: email.trim(), role }
            : user
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: name.trim(),
          email: email.trim(),
          role,
          status: "Active",
          joined: new Date().toISOString().slice(0, 10),
        },
      ]);
    }

    setModalOpen(false);
    setNotice("");
  }

  function toggleStatus(id) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  }

  function deleteUser(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    setUsers((prev) => prev.filter((item) => item.id !== user.id));
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Users
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage registered users and their roles.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + Add User
        </button>
      </div>

      {/* Notice */}
      {notice && !modalOpen && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {notice}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: users.length },
          { label: "Active Users", value: activeUsers },
          { label: "Inactive Users", value: inactiveUsers },
          { label: "Authors", value: authors },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Author">Author</option>
          <option value="Reader">Reader</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {user.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                  {user.joined}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => openEdit(user)}
                      className="rounded-md px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`rounded-md px-3 py-1.5 font-medium ${
                        user.status === "Active"
                          ? "text-orange-700 hover:bg-orange-50"
                          : "text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteUser(user)}
                      className="rounded-md px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No users found.
          </p>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editing ? "Edit User" : "Add User"}
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {notice && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {notice}
              </div>
            )}

            <form onSubmit={saveUser} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
                >
                  <option value="Reader">Reader</option>
                  <option value="Author">Author</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  {editing ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
