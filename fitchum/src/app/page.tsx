export default function Home() {
  return (
    <>
      <div className="col-span-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
            Welcome to FitChum
          </h1>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70">
            Your fitness journey starts here.
          </p>
        </div>
      </div>
    </>
  );
}