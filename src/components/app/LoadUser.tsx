import { useCallback, useEffect, useState } from 'react';
import UserRepository from 'libs/UserRepository';

const LoadUser = ({ repository, onError, render }: {
  repository: UserRepository,
  onError: (msg: string) => void;
  render: () => JSX.Element;
}
) => {
  const [user, setUser] = useState<any>();

  const loadUser = useCallback(async()=>{
    try {
      setUser(await repository.getUser());
    } catch (err) {
      if (err instanceof Error) {
        onError(err.message);
      }
    }
  }, [repository, onError]);

  useEffect(() => {
    if (!user) { loadUser(); }
  }, [user, loadUser]);

  return render();
};

export default LoadUser;
