import Image from 'next/image'
import { Inter } from 'next/font/google'
import hash from 'object-hash'
import { ChangeEvent, useState } from 'react';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import Head from "next/head";
import Main from '@/components/home/main';


export default function Home() {
  return (
    <>
      <Head>
        <title>ice-cream | Build your ai application quickly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      {/* <Footer /> */}
    </>
  )
}
