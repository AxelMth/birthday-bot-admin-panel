import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('lib/pages/dashboard/index.tsx'),
  route('person/create', 'lib/pages/dashboard/create/index.tsx'),
  route('person/:id/edit', 'lib/pages/dashboard/edit/index.tsx'),
  route('*', 'lib/pages/404.tsx'),
] satisfies RouteConfig;
