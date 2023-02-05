import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import Logo from '../../public/assets/images/Logo.webp';

const Index = () => {
  const [hasAccount, setHasAccount] = useState(true);

  const themeOptions = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
  ];
  const [currentTheme, setCurrentTheme] = useState('light');
  const updateHasAccount: () => void = () => {
    setHasAccount((prevVal) => !prevVal);
  };
  const { push } = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('theme', currentTheme);
      if (sessionStorage.getItem('token')) {
        push('/dashboard');
      }
    }
  }, []);
  return (
    <Main
      meta={<Meta title="Login" description="AlphaBi task" />}
      theme={currentTheme}
    >
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:w-full lg:flex-row-reverse lg:items-start lg:justify-evenly">
          <div className="text-center lg:text-left">
            <h1 className="mb-8 text-5xl font-bold">
              {hasAccount ? 'Login now!' : 'Sign Up Now!'}
            </h1>
            <h3 className="mb-8 text-2xl font-bold">
              Select theme from below:
            </h3>
            <div className="flex flex-wrap">
              {themeOptions.map((theme) => (
                <button
                  className={`btn-info btn m-2 ${
                    theme === currentTheme ? 'btn-primary' : 'btn-outline'
                  }`}
                  key={theme}
                  onClick={() => {
                    setCurrentTheme(theme);
                    sessionStorage.setItem('theme', theme);
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body items-center">
              <Image
                src={Logo}
                alt="hero-icon"
                className="max-w-sm rounded-lg shadow-2xl"
              />
              <h1 className="mb-4 text-xl">Welcome to AlphaBi</h1>
              {hasAccount ? (
                <Login updateHasAccount={updateHasAccount} />
              ) : (
                <SignUp updateHasAccount={updateHasAccount} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
