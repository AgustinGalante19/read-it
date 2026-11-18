import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import Providers from "@/components/providers"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Read It",
  description: "My personal to use as readlist",
  appleWebApp: {
    title: "Read-It",
  },
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
      <body className={`${roboto.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
