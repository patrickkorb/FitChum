export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-neutral-dark p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}