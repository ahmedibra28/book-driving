import Meta from '@/components/Meta'
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Providers from '@/lib/provider'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata = {
  ...Meta({}),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} bg-gray-100`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <div className='navbar z-50 h-[68px] flex justify-between items-center bg-white px-5'>
            <div>
              <Link href='/' className='w-24 normal-case text-xl'>
                <Image
                  src='https://ahmedibra.com/logo.png'
                  width={40}
                  height={40}
                  alt='logo'
                  className='rounded'
                />
              </Link>
            </div>
            <Navigation />
          </div>
          <div>
            <main className='flex min-h-[84vh] flex-col'>{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
