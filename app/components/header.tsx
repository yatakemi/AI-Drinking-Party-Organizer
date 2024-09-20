import { Link } from '@remix-run/react'

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">飲み会幹事AIアシスタント</h1>
          <p className="text-sm mt-1">
            簡単4ステップで最適なお店を見つけましょう
          </p>
        </div>

        <nav className="flex gap-4">
          <Link to="/" className="text-primary-foreground hover:underline">
            Top
          </Link>
          <Link to="/terms" className="text-primary-foreground hover:underline">
            注意事項
          </Link>
        </nav>
      </div>
    </header>
  )
}
