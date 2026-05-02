"use client";

import { useState, useTransition } from "react";
import { getUsers, addUser } from "@/actions/test";

type User = {
  id: number;
  name: string | null;
  email: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("John Doe");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLoadUsers = async () => {
    setMessage(null);

    try {
      const result = await getUsers();
      setUsers(result ?? []);
      setMessage("Loaded users successfully.");
    } catch (error) {
      setMessage("Unable to load users. Try again.");
    }
  };

  const handleAddUser = async () => {
    if (!name.trim()) {
      setMessage("Please enter a name before adding a user.");
      return;
    }

    setMessage(null);

    startTransition(async () => {
      try {
        const user = await addUser(name.trim());
        setUsers((current) => [...current, user]);
        setName("");
        setMessage(`Added ${user.name} successfully.`);
      } catch (error) {
        setMessage("Unable to add user. Try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10">
        <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-10 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/80 dark:shadow-black/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-600">User manager</p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
                Connect your Prisma actions to a beautiful interface.
              </h1>
              <p className="max-w-xl text-slate-600 dark:text-slate-300">
                Load users from your database, add new team members, and preview the current list using clean, responsive controls designed for production-ready workflows.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={handleLoadUsers}
                className="rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                {isPending ? "Loading..." : "Load users"}
              </button>
              <button
                onClick={handleAddUser}
                className="rounded-3xl border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                {isPending ? "Adding..." : "Add user"}
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-inner shadow-slate-200/80 dark:bg-slate-900 dark:text-slate-200">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">
              New user name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter a friendly name"
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-sky-400 dark:focus:ring-sky-500/20"
            />
          </div>

          {message ? (
            <div className="mt-6 rounded-3xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-slate-900 dark:border-sky-800/70 dark:bg-slate-900 dark:text-slate-100">
              {message}
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/80 dark:shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  User list
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                  Current database users
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {users.length} total
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {users.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No users yet. Click “Load users” to fetch the current list.
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-950"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{user.name}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        User
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/80 dark:shadow-black/20">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">How it works</h3>
            <div className="mt-6 space-y-5 text-slate-600 dark:text-slate-300">
              <p>
                The page calls Prisma-backed server actions directly from the client. Use the buttons to fetch the current user list or add a new user in one click.
              </p>
              <p>
                New users are created with an autogenerated email, and the list refreshes immediately so you can see the result without reloading the page.
              </p>
              <p>
                This layout is responsive and built with modern utility classes to look clean on desktop and mobile.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
