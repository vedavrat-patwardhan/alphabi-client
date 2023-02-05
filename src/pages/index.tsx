import Image from 'next/image';
import React, { useState } from 'react';

import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import Logo from '../../public/assets/images/Logo.webp';

const Index = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const updateHasAccount: () => void = () => {
    setHasAccount((prevVal) => !prevVal);
  };
  return (
    <Main meta={<Meta title="Login" description="AlphaBi task" />}>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
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
