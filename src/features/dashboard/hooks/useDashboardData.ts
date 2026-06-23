import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboardService';
import queryKeys from '../../../constants/queryKeys';

export const useDashboardData = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardService.getDashboardData,
  });
};

export default useDashboardData;
