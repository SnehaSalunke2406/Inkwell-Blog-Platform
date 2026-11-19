
import { useMemo, useState } from "react";

const initialComments = [
  {
    id: 1,
    author: "Aarav Sharma",
    email: "aarav@example.com",
    blog: "Getting Started with React",
    content: "This article helped me understand React much better. Great explanation!",
    status: "Approved",
    date: "2026-11-15",
  },
  {
    id: 2,
    author: "Priya Patil",
    email: "priya@example.com",
    blog: "The Future of Artificial Intelligence",
    content: "Very informative article. Looking forward to more content like this.",
    status: "Pending",
    date: "2026-11-16",
  },
  {
    id: 3,
    author: "Rahul Verma",
    email: "rahul@example.com",
    blog: "Web Development Tips",
    content: "Nice article! The examples were easy to follow.",
    status: "Pending",
    date: "2026-11-17",
  },
  {
    id: 4,
    author: "Sneha Joshi",
    email: "sneha@example.com",
    blog: "Learning JavaScript",
    content: "I really enjoyed reading this post.",
    status: "Rejected",
    date: "2026-11-18",
  },
  {
    id: 5,
    author: "Aditya Kulkarni",
    email: "aditya@example.com",
    blog: "CSS Design Techniques",
    content: "Thanks for sharing these tips. They are useful!",
    status: "Approved",
    date: "2026-11-18",
  },
];

const statusStyles = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function CommentsPage() {
  const [comments, setComments] = useState(initialComments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch = [
        comment.author,
        comment.email,
        comment.blog,
        comment.content,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || comment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [comments, search, filter]);

  function updateStatus(id, status) {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id ? { ...comment, status } : comment
      )
    );
  }

  function deleteComment(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    setComments((prev) => prev.filter((comment) => comment.id !== id));
  }

  const approved = comments.filter((c) => c.status === "Approved").length;
  const pending = comments.filter((c) => c.status === "Pending").length;
  const rejected = comments.filter((c) => c.status === "Rejected").length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Comments
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage and moderate comments on your blogs.
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Comments", value: comments.length },
          { label: "Approved", value: approved },
          { label: "Pending", value: pending },
          { label: "Rejected", value: rejected },
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
          placeholder="Search author, blog or comment..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Comments table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Comment</th>
              <th className="px-5 py-3 font-medium">Blog</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredComments.map((comment) => (
              <tr key={comment.id} className="align-top hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {comment.author}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {comment.email}
                  </p>
                </td>

                <td className="max-w-xs px-5 py-4 text-slate-700">
                  {comment.content}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {comment.blog}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[comment.status]}`}
                  >
                    {comment.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                  {comment.date}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    {comment.status !== "Approved" && (
                      <button
                        onClick={() => updateStatus(comment.id, "Approved")}
                        className="rounded-md px-3 py-1.5 font-medium text-green-700 hover:bg-green-50"
                      >
                        Approve
                      </button>
                    )}

                    {comment.status !== "Rejected" && (
                      <button
                        onClick={() => updateStatus(comment.id, "Rejected")}
                        className="rounded-md px-3 py-1.5 font-medium text-orange-700 hover:bg-orange-50"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => deleteComment(comment.id)}
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

        {filteredComments.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No comments found.
          </p>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        Showing {filteredComments.length} of {comments.length} comments
      </p>
    </main>
  );
}
