import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('lib/pages/dashboard/index.tsx'),
  route('create', 'lib/pages/dashboard/create/index.tsx'),
  route('edit/:id', 'lib/pages/dashboard/edit/index.tsx'),
  route('*', 'lib/pages/404.tsx'),
] satisfies RouteConfig;
