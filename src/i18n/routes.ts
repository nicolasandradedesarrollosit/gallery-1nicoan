/**
 * Every page of the site and its path. Components resolve URLs from here and never
 * write one by hand.
 */
export const ROUTES = {
  home: '/',
} as const satisfies Record<string, string>;

export type RouteId = keyof typeof ROUTES;

export const path = (route: RouteId = 'home'): string => ROUTES[route];
