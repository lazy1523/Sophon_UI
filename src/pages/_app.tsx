import Layout from '@/components/sophon/layout/layout'
import Loading from '@/components/sophon/loading/loading'
import { Toaster } from '@/components/ui/toaster'
import '@/src/styles/globals.css'
import { userState } from '@/store/globalState'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RecoilRoot, useRecoilState } from 'recoil'
export default function App({ Component, pageProps }: AppProps) {

  const ComponentWithUser = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    const [, setUser] = useRecoilState(userState);

    const accessibleRoutesWhenNotLoggedIn = ['/auth/login', '/auth/forgot', '/auth/register'];

    useEffect(() => {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        setUser(JSON.parse(storedUserData));
      } else if (!accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
        router.push('/auth/login');
      }
    }, [router, setUser]);

    if (accessibleRoutesWhenNotLoggedIn.includes(router.pathname)) {
      return <Component {...pageProps} />
    }

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  };

  return (
    <RecoilRoot>
      <ComponentWithUser Component={Component} {...pageProps} />
      <Toaster />
      {/*  解开注释即可启用全局loading 会破坏用户的心流  */}
      {/* <Loading/> */}
    </RecoilRoot>
  )
}
