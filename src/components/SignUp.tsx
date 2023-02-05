import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import validator from 'validator';

import useForm from './useForm';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC<{
  updateHasAccount: () => void;
}> = ({ updateHasAccount }) => {
  const { push } = useRouter();
  const notify = () => toast('Account created Successfully!');
  const initialValue: FormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ ...initialValue });
  const { values, handleChange } = useForm({ ...initialValue });
  const isValid = () => {
    const temp: FormValues = initialValue;
    temp.email = validator.isEmail(values.email) ? '' : 'Invalid mail Id';
    temp.password =
      values.password.length > 7
        ? ''
        : 'Password should be at least 8 characters long';
    temp.confirmPassword =
      values.confirmPassword === values.password
        ? ''
        : 'Should match with password';
    if (!Object.values(temp).every((x) => x === '')) {
      setErrors(temp);
    } else {
      setErrors({ ...initialValue });
    }
    return Object.values(temp).every((x) => x === '');
  };
  const handleSubmit = () => {
    if (isValid()) {
      setIsLoading(true);
      axios
        .post(`${process.env.BASE_URL}/v1/auth/create-user`, {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          sessionStorage.setItem('token', res.data.data.token);
          sessionStorage.setItem('user', JSON.stringify(res.data.data.data));
          setIsLoading(false);
          notify();
          push('/dashboard');
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          const msg = err.response.data.message;
          if (msg === 'This mailId is already registered') {
            setErrors((prevVal) => ({
              ...prevVal,
              email: msg,
            }));
          }
        });
    }
  };
  return (
    <>
      <label htmlFor="sign-up-form" className="label">
        Create account
      </label>
      <div className="form-control w-full">
        <input
          type="email"
          placeholder="Email"
          className={`input-bordered input ${
            errors.email ? 'input-error' : ''
          }`}
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && (
          <label className="label pt-0">
            <span className="label-text-alt text-red-600  ">
              {errors.email}
            </span>
          </label>
        )}
      </div>
      <div className="form-control w-full">
        <input
          type="password"
          placeholder="Password"
          className={`input-bordered input ${
            errors.password ? 'input-error' : ''
          }`}
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && (
          <label className="label pt-0">
            <span className="label-text-alt text-red-600  ">
              {errors.password}
            </span>
          </label>
        )}
        <input
          type="password"
          placeholder="Confirm password"
          className={`input-bordered input mt-2 ${
            errors.confirmPassword ? 'input-error' : ''
          }`}
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <label className="label pt-0">
            <span className="label-text-alt text-red-600  ">
              {errors.confirmPassword}
            </span>
          </label>
        )}
      </div>
      <div className="form-control mb-8 w-full">
        <button
          className={`btn-primary btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
        >
          SignUp
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        <span>Have an account?</span>
        <button
          className="btn-outline  btn-secondary btn"
          onClick={updateHasAccount}
        >
          LogIn
        </button>
      </div>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default SignUp;
