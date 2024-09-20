import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import stylesheet from './tailwind.css?url'
import { LinksFunction } from '@remix-run/node'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Button } from './components/ui/button'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export function ErrorBoundary() {
  return (
    <div className="flex justify-center flex-col items-center h-screen">
      <h1 className="text-3xl font-bold">
        Something went wrong. <br />
        Please try again later.
      </h1>
      <Button
        variant="destructive"
        className="w-24 my-8"
        onClick={() => window.location.reload()}
      >
        Reload
      </Button>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header></header>
        <div className="min-h-screen bg-background flex flex-col min-w-96">
          <Header />
          <main className="container mx-auto px-4 py-6 flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
