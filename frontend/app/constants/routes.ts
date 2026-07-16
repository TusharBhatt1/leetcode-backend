export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  problems: '/problems',
  problem: (id: string) => `/problem/${id}`,
  dashboard: '/dashboard',
};

export const AUTH_ROUTES = [ROUTES.login, ROUTES.signup];
export const PUBLIC_ROUTES = [...AUTH_ROUTES, ROUTES.home];
