export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t shadow-md bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <h1 className="text-md md:text-2xl text-neutral-800 font-bold">
          Taskify
        </h1>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Privacy Policy
          </button>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Terms of Service
          </button>
        </div>
      </div>
    </div>
  );
};
