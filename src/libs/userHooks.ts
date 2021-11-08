import { useLocation } from 'react-router';
import { parseSearchParameters } from '../components/pages/GroupIndexPage';

/**
 * Use useSearchParams of react-router-dom v6 instead
 */
export const useSearchParams = (): { [key: string]: string; } => {
  const location = useLocation();

  return parseSearchParameters(location.search);
};
