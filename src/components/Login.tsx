import React, { useState } from 'react';
import validator from 'validator';

import useForm from './useForm';

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC<{
  updateHasAccount: () => void;
}> = ({ updateHasAccount }) => {
  const initialValue: FormValues = {
    email: '',
    password: '',
  };
  const [errors, setErrors] = useState({ ...initialValue });
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
      console.log(values);
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
        <label className="label">
          <a
            href="#"
            className="link-hover label-text-alt link"
            onClick={() => alert('Not yet implemented')}
          >
            Forgot password?
          </a>
        </label>
      </div>
      <div className="form-control mb-8 w-full">
        <button className="btn-primary btn" onClick={handleSubmit}>
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
    </>
  );
};

export default Login;