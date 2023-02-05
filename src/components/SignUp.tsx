import React, { useState } from 'react';
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
  const initialValue: FormValues = {
    email: '',
    password: '',
    confirmPassword: '',
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
      console.log(values);
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
        <button className="btn-primary btn" onClick={handleSubmit}>
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
    </>
  );
};

export default SignUp;
