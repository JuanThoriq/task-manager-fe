import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <main className="flex-1 pt-40 pb-20 bg-slate-100">{children}</main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
