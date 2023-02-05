import type { BaseSyntheticEvent, Dispatch } from 'react';
import { useState } from 'react';

const useForm: (initialValue: any) => {
  values: any;
  setValues: Dispatch<any>;
  handleChange: (e: BaseSyntheticEvent) => void;
} = (initialValue) => {
  const [values, setValues] = useState(initialValue);
  const handleChange = (e: BaseSyntheticEvent) => {
    const { name, value } = e.target;
    setValues((prevVal: any) => ({
      ...prevVal,
      [name]: value,
    }));
  };

  return {
    values,
    setValues,
    handleChange,
  };
};

export default useForm;
