import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import validator from 'validator';

import PassInput from './PassInput';
import useForm from './useForm';

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC<{
  updateHasAccount: () => void;
}> = ({ updateHasAccount }) => {
  const { push } = useRouter();
  const notify = () => toast('Logged In Successfully!');
  const initialValue: FormValues = {
    email: '',
    password: '',
  };
  const [errors, setErrors] = useState({ ...initialValue });
  const [isLoading, setIsLoading] = useState(false);
  const { values, handleChange } = useForm({ ...initialValue });
  const isValid = () => {
    const temp: FormValues = initialValue;
    temp.email = validator.isEmail(values.email) ? '' : 'Invalid mail Id';
    temp.password =
      values.password.length > 7
        ? ''
        : 'Password should be at least 8 characters long';
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
        .post(`${process.env.BASE_URL}/v1/auth/login-user`, values)
        .then((res) => {
          setIsLoading(false);
          sessionStorage.setItem('token', res.data.data.token);
          sessionStorage.setItem('user', JSON.stringify(res.data.data.data));
          notify();
          push('/dashboard');
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          const msg = err.response.data.message;
          if (msg === 'User not found') {
            setErrors((prevVal) => ({
              ...prevVal,
              email:
                'You are not registered with this email address. Please use another email address or sign up',
            }));
          }
          if (msg === 'Invalid credentials') {
            setErrors((prevVal) => ({
              ...prevVal,
              password: 'Password is incorrect',
            }));
          }
        });
    }
  };
  return (
    <>
      <label htmlFor="login-form" className="label">
        Please login to your account
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
      <PassInput
        error={errors.password}
        name="password"
        placeholder="Password"
        value={values.password}
        handleChange={handleChange}
      >
        <label className="label">
          <a
            href="#"
            className="link-hover label-text-alt link"
            onClick={() => alert('Not yet implemented')}
          >
            Forgot password?
          </a>
        </label>
      </PassInput>
      <div className="form-control mb-8 w-full">
        <button
          className={`btn-primary btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
        >
          Login
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        <span>{"Don't"} have an account?</span>
        <button
          className="btn-outline  btn-secondary btn"
          onClick={updateHasAccount}
        >
          Sign Up
        </button>
      </div>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default Login;
