import { RouteObject, createBrowserRouter } from 'react-router-dom';
import type { Router as RemixRouter } from '@remix-run/router';
import * as Sentry from '@sentry/react';

import * as Screens from '@app/screens';
import { User } from '@app/models';

/**
 * Evalua si el usuario tiene permisos para acceder a la ruta
 * @param user Usuario logueado
 * @param pathsnames Rutas a validar. Sentencia: path_1 OR path_2 OR path_3 OR ...
 * @returns true si tiene permisos para acceder a alguna de las rutas pasadas como parámetro
 */
export const routeAuthorized = (user: User | null | undefined, pathsname: `/${string}`): boolean => {
    if (user?.permissions?.includes('Admin')) return true;
    let enable = false;

    if (pathsname === '/admin/user') enable = !!user?.permissions?.includes('UserAdmin');
    else if (pathsname === '/admin/bot') enable = !!user?.permissions?.includes('BotAdmin');

    return enable;
};

//? Rutas de la aplicación
const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export const router = sentryCreateBrowserRouter(
    [
        {
            path: '/',
            element: <Screens.Layout />,
            errorElement: <Screens.Error500 />,
            hasErrorBoundary: true,
            caseSensitive: false,
            children: [
                {
                    index: true,
                    element: <Screens.Main />,
                },
                {
                    path: 'about',
                    element: <Screens.About />,
                },
                {
                    path: 'invite',
                    element: <Screens.Invite />,
                },
                {
                    path: 'commands',
                    element: <Screens.Commands />,
                },
                {
                    path: 'status',
                    element: <Screens.Status />,
                },
                {
                    path: 'support',
                    element: <Screens.Support />,
                },
                {
                    path: 'privacy',
                    element: <Screens.Privacy />,
                },
                {
                    path: 'terms',
                    element: <Screens.Terms />,
                },
                {
                    path: 'developer',
                    element: <Screens.Developer />,
                },
                {
                    path: 'profile',
                    element: <Screens.Profile />,
                },
                {
                    path: 'dashboard/:id',
                    element: <Screens.Dashboard />,
                },
                {
                    path: 'leaderboard/:id',
                    element: <Screens.LeaderBoard />,
                },
                {
                    path: 'logout',
                    element: <Screens.Logout />,
                },
                {
                    path: 'error403',
                    element: <Screens.Error403 />,
                },
                {
                    path: 'error404',
                    element: <Screens.Error404 />,
                },
                {
                    path: 'error500',
                    element: <Screens.Error500 />,
                },
            ],
        },
    ] as RouteObject[],
    {
        basename: import.meta.env.VITE_BASE_URL || '/',
    },
) as RemixRouter;

export default router;
