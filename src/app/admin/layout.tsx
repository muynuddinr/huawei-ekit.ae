import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Huawei eKit UAE",
  description: "Admin dashboard for Huawei eKit UAE",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {children}
    </div>
  );
}