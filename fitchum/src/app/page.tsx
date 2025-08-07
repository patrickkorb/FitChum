export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark dark:text-neutral-light mb-4">
            Welcome to FitChum
          </h1>
          <p className="text-base sm:text-lg text-neutral-dark/70 dark:text-neutral-light/70">
            Your fitness journey starts here.
          </p>
        </div>
      </div>
    </>
  );
}