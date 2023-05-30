import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextProgress from "next-progress";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextProgress options={{ showSpinner: false }} color='#009677'/>
      <Component {...pageProps} />
    </>
  )
}
