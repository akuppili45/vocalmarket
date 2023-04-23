import FullLayout from "../src/layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";
import { SWRConfig } from "swr";
import fetchJson, { FetchError } from "../lib/fetchJson";


function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
    value={{
      fetcher: fetchJson,
      onError: (err) => {
        console.error(err);
      },
    }}
  >
      <Head>
        <title>Accapella Marketplace</title>
        <meta
          name="description"
          content="Monster Free Next Js Dashboard Template"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FullLayout>
        <Component {...pageProps} />
      </FullLayout>
      </SWRConfig>
  );
}

export default MyApp;
