
import { useMemo, useState } from "react";
import { initialBlogs } from "../lib/blogs";

const initialCategories = [
  ...new Set(initialBlogs.map((blog) => blog.category)),
].map((name, index) => ({
  id: index + 1,
  name,
  description: `Blogs related to ${name}.`,
}));

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  function openAdd() {
    setEditing(null);
    setName("");
    setDescription("");
    setModalOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    setName(category.name);
    setDescription(category.description);
    setModalOpen(true);
  }

  function saveCategory(e) {
    e.preventDefault();

    if (!name.trim()) return;

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === name.trim().toLowerCase() &&
        category.id !== editing?.id
    );

    if (duplicate) {
      setNotice("This category already exists.");
      return;
    }

    if (editing) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editing.id
            ? { ...category, name: name.trim(), description: description.trim() }
            : category
        )
      );
      setNotice("Category updated successfully.");
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: name.trim(),
          description: description.trim(),
        },
      ]);
      setNotice("Category added successfully.");
    }

    setModalOpen(false);
  }

  function deleteCategory(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setCategories((prev) =>
      prev.filter((item) => item.id !== category.id)
    );
    setNotice("Category deleted successfully.");
  }

  function getBlogCount(categoryName) {
    return initialBlogs.filter(
      (blog) => blog.category === categoryName
    ).length;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Organize your blogs into categories.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          + Add Category
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div className="mt-5 flex justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {notice}
          <button onClick={() => setNotice("")}>✕</button>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Categories</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Blogs</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {initialBlogs.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 sm:max-w-md"
        />
      </div>

      {/* Category Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Blogs</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {category.name}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {category.description || "No description"}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {getBlogCount(category.name)}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(category)}
                      className="rounded-md px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(category)}
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

        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No categories found.
          </p>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Showing {filtered.length} of {categories.length} categories
      </p>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {editing ? "Edit Category" : "Add Category"}
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveCategory} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter category name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter category description"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
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
                  {editing ? "Save Changes" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
