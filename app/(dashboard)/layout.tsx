import { NavbarDashboard } from "./components/navbar-dahboard";
import { SidebarDashboard } from "./components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="h-full flex-col justify-center items-center bg-slate-100">
      <NavbarDashboard />
      <section className="flex pt-14 bg-slate-100">
        <SidebarDashboard />
        <main className="flex-1 p-4 h-screen">{children}</main>
      </section>
    </section>
  );
};

export default DashboardLayout;
