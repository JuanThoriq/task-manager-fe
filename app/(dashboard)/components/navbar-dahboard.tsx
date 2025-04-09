import Link from "next/link";

export const NavbarDashboard = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b-black-50 shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <h1 className="text-md md:text-2xl text-neutral-800 font-bold">
          Taskify
        </h1>
        <div className="md:flex md:w-auto">
          <button className="px-4 py-2 rounded-md bg-black hover:bg-black/80 text-white font-semibold">
            <Link href="/auth/sign-in">Logout</Link>
          </button>
        </div>
      </div>
    </div>
  );
};
