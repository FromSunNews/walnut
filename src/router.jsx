import { createBrowserRouter } from 'react-router-dom';
import ClusterManager from './components/apps/suidnet/dashboard/cloud-workspace/manage-cluster';
import WorkerNodeDetail from './components/apps/suidnet/dashboard/components/WorkerNodeDetail';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ClusterManager />
    },
    {
        path: '/worker/:workerId',
        element: <WorkerNodeDetail />
    }
]); 