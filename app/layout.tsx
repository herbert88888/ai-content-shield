import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AIContentShield - AI Content Compliance Checker',
  description: 'Detect AI-generated content, check for plagiarism, assess copyright risks, and generate compliance disclosures.',
  keywords: 'AI detection, plagiarism checker, content compliance, SEO, copyright',
  authors: [{ name: 'AIContentShield' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}