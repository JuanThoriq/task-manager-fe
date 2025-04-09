// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="flex items-center justify-center flex-col h-full">
      <div className="flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 font-bold rounded-full uppercase">
          No 1 task managment
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6 font-semibold">
          Taskify helps team move
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold px-4 p-2 rounded-md pb-4 w-fit">
          work forward.
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique -
        accomplish it all with Taskify.
      </div>
      <button className="mt-6 px-4 py-2 rounded-md bg-black text-white font-semibold hover:bg-black/80">
        <Link href="/auth/register">Get Taskify for free</Link>
      </button>
    </section>
  );
}
