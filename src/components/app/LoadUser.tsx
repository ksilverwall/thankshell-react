import { useEffect, useState } from 'react';
import UserRepository from 'libs/UserRepository';

const LoadUser = ({ repository, onError, render }: {
  repository: UserRepository,
  onError: (msg: string) => void;
  render: () => JSX.Element;
}
) => {
  const [user, setUser] = useState<any>();

  const loadUser = async () => {
    try {
      setUser(await repository.getUser());
    } catch (err) {
      onError(err.message);
    }
  };

  useEffect(() => {
    if (!user) { loadUser(); }
  }, [user]);

  return render();
};

export default LoadUser;
