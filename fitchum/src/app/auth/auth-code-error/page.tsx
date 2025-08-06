import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <Card className="text-center space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
          Anmeldung fehlgeschlagen
        </h1>
        <p className="text-neutral-dark/70 dark:text-neutral-light/70">
          Es gab ein Problem bei der Anmeldung. Bitte versuche es erneut.
        </p>
      </div>

      <div className="space-y-3">
        <Button variant="primary" className="w-full">
          <Link href="/auth/login">Erneut versuchen</Link>
        </Button>
        
        <Button variant="outline" className="w-full">
          <Link href="/">Zur Startseite</Link>
        </Button>
      </div>
    </Card>
  )
}