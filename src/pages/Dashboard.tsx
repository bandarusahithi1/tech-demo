import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";   // ✅ type import only
import { auth } from "../lib/firebase";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activePage, setActivePage] = useState<
    "profile" | "tickets" | "projects" | "settings"
  >("profile");

  const [darkMode, setDarkMode] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<null | string>(null);
  const [selectedProject, setSelectedProject] = useState<null | string>(null);

  // load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const agent = {
    id: "AGT-2025-001",
    name: user.displayName || "Unknown User",
    role: "Support Agent",
    lastLogin: new Date().toLocaleString(),
  };

  const projects = [
    { id: "P-101", name: "Customer Onboarding", status: "In Progress", desc: "Helping customers onboard smoothly." },
    { id: "P-102", name: "Support Automation", status: "Completed", desc: "Automated common support workflows." },
    { id: "P-103", name: "Agent Training", status: "Pending", desc: "Upcoming training for new agents." },
  ];

  const tickets = [
    { id: "T-2001", subject: "Login issue", status: "Open", details: "User cannot log in to the portal." },
    { id: "T-2002", subject: "Payment failed", status: "Closed", details: "Resolved payment gateway error." },
    { id: "T-2003", subject: "Bug in dashboard", status: "In Progress", details: "Dashboard not loading for some users." },
  ];

  const ticketDetail = tickets.find((t) => t.id === selectedTicket);
  const projectDetail = projects.find((p) => p.id === selectedProject);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  // render content
  const renderContent = () => {
    if (activePage === "tickets") {
      if (selectedTicket && ticketDetail) {
        return (
          <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-lg">
            <button onClick={() => setSelectedTicket(null)} className="mb-4 text-blue-500 hover:underline">
              ← Back to Tickets
            </button>
            <h2 className="text-xl font-bold mb-2">🎫 Ticket Detail</h2>
            <p><span className="font-semibold">ID:</span> {ticketDetail.id}</p>
            <p><span className="font-semibold">Subject:</span> {ticketDetail.subject}</p>
            <p><span className="font-semibold">Status:</span> {ticketDetail.status}</p>
            <p><span className="font-semibold">Details:</span> {ticketDetail.details}</p>
          </div>
        );
      }
      return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">🎫 Tickets</h2>
          <ul className="space-y-3">
            {tickets.map((t) => (
              <li key={t.id} onClick={() => setSelectedTicket(t.id)} className="border p-3 rounded-lg hover:shadow dark:border-gray-600 cursor-pointer">
                <p><span className="font-semibold">ID:</span> {t.id}</p>
                <p><span className="font-semibold">Subject:</span> {t.subject}</p>
                <p><span className="font-semibold">Status:</span> {t.status}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (activePage === "projects") {
      if (selectedProject && projectDetail) {
        return (
          <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-lg">
            <button onClick={() => setSelectedProject(null)} className="mb-4 text-blue-500 hover:underline">
              ← Back to Projects
            </button>
            <h2 className="text-xl font-bold mb-2">📂 Project Detail</h2>
            <p><span className="font-semibold">ID:</span> {projectDetail.id}</p>
            <p><span className="font-semibold">Name:</span> {projectDetail.name}</p>
            <p><span className="font-semibold">Status:</span> {projectDetail.status}</p>
            <p><span className="font-semibold">Description:</span> {projectDetail.desc}</p>
          </div>
        );
      }
      return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">📂 Projects</h2>
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id} onClick={() => setSelectedProject(p.id)} className="border p-3 rounded-lg hover:shadow dark:border-gray-600 cursor-pointer">
                <p><span className="font-semibold">ID:</span> {p.id}</p>
                <p><span className="font-semibold">Name:</span> {p.name}</p>
                <p><span className="font-semibold">Status:</span> {p.status}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (activePage === "profile") {
      return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">👤 Profile</h2>
          <p><span className="font-semibold">Agent ID:</span> {agent.id}</p>
          <p><span className="font-semibold">Name:</span> {agent.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {agent.role}</p>
          <p><span className="font-semibold">Last Login:</span> {agent.lastLogin}</p>
        </div>
      );
    }

    if (activePage === "settings") {
      return (
        <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">⚙️ Settings</h2>
          <div className="flex items-center justify-between">
            <span>🌙 Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? "bg-yellow-500 text-black hover:bg-yellow-600"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
            >
              {darkMode ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-blue-600 dark:bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Agent Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm">
          Sign Out
        </button>
      </nav>

      {/* Layout with Sidebar */}
      <div className="flex flex-1">
        <aside className="w-64 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-md p-6">
          <h2 className="text-lg font-semibold mb-6">Menu</h2>
          <ul className="space-y-4">
            <li className={`cursor-pointer hover:text-blue-600 ${activePage === "profile" ? "font-bold text-blue-600" : ""}`}
                onClick={() => { setActivePage("profile"); setSelectedTicket(null); setSelectedProject(null); }}>
              📄 Profile
            </li>
            <li className={`cursor-pointer hover:text-blue-600 ${activePage === "tickets" ? "font-bold text-blue-600" : ""}`}
                onClick={() => { setActivePage("tickets"); setSelectedTicket(null); }}>
              🎫 Tickets
            </li>
            <li className={`cursor-pointer hover:text-blue-600 ${activePage === "projects" ? "font-bold text-blue-600" : ""}`}
                onClick={() => { setActivePage("projects"); setSelectedProject(null); }}>
              📂 Projects
            </li>
            <li className={`cursor-pointer hover:text-blue-600 ${activePage === "settings" ? "font-bold text-blue-600" : ""}`}
                onClick={() => { setActivePage("settings"); setSelectedTicket(null); setSelectedProject(null); }}>
              ⚙️ Settings
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 flex items-start justify-center">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
