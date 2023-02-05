import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
  theme?: string;
};

const Main = (props: IMainProps) => {
  const [appTheme, setAppTheme] = useState('light');
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof sessionStorage.getItem('theme') === 'string'
    ) {
      setAppTheme(sessionStorage.getItem('theme')!);
    }
  }, [props]);
  return (
    <div data-theme={props.theme || appTheme}>
      {props.meta}
      <div className="box-border">{props.children}</div>
    </div>
  );
};

export { Main };
