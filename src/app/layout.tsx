import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import Providers from "@/components/providers"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Read It",
  description: "My personal to use as readlist",
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <meta name='apple-mobile-web-app-title' content='Read-It' />
      </head>
      <body className={`${roboto.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
