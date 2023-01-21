import { useEffect } from 'react';

export const useScript = (url: string) => {
  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = url;
    scriptElement.defer = true;

    document.head.append(scriptElement);

    return () => {
      document.head.removeChild(scriptElement);
    };
  }, [url]);
};
