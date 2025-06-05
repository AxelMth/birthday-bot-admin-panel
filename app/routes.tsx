import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  route('person/:id/edit', './routes/edit-person.tsx'),
  route('person/create', './routes/create-person.tsx'),
] satisfies RouteConfig;
