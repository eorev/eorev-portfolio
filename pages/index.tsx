// pages/index.tsx

import Head from 'next/head';
import Layout from '@/app/layout';
import MainContent from '../components/MainContent';
import '@/app/globals.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethan&apos;s Portfolio</title>
        <meta name="description" content="Ethan's Portfolio Website" />
      </Head>
      <Layout>
        <main>
          <MainContent />
        </main>
      </Layout>
    </>
  );
}
