import { useApp } from '../context/AppContext';
import type { Page } from '../types';

export function useRouter() {
  const { state, dispatch } = useApp();

  const navigate = (page: Page, propertyId?: string) => {
    dispatch({ type: 'SET_PAGE', payload: page });
    if (propertyId) {
      dispatch({ type: 'SET_PROPERTY', payload: propertyId });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage: state.currentPage,
    currentPropertyId: state.currentPropertyId,
    navigate,
  };
}
