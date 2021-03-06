import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { EmployeeGuard } from './core/auth/guards/employee.guard';
import { AdminGuard } from './core/auth/guards/admin.guards';
import { TesterGuard } from './core/auth/guards/tester.guard';
import { ProcessorGuard } from './core/auth/guards/processor.guard';
import { ManufacturerGuard } from './core/auth/guards/manufacturer.guard';
import { DisposalGuard } from './core/auth/guards/disposal.guard';
import { DistributorGuard } from './core/auth/guards/distributor.guard';
import { WellnessGuard } from './core/auth/guards/wellness.guard';
import { DispensaryGuard } from './core/auth/guards/dispensary.guard';

export const appRoutes: Route[] = [
    { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },

    // {
    //     path: 'signed-in-redirect',
    //     pathMatch: 'full',
    //     redirectTo: 'admin/dashboard',
    // },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
            // { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
            // { path: '**', redirectTo: 'sign-in' },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.module').then(
                        (m) => m.LandingHomeModule
                    ),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'admin',
                canActivate: [AdminGuard],
                children: [
                    {
                        path: 'dashboard',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboard/dashboard.module'
                            ).then((m) => m.DashboardModule),
                    },
                    {
                        path: 'plants',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/plants/plants.module'
                            ).then((m) => m.PlantsModule),
                    },
                    {
                        path: 'products',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/products/products.module'
                            ).then((m) => m.ProductsModule),
                    },
                    {
                        path: 'businesses',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/businesses/businesses.module'
                            ).then((m) => m.BusinessesModule),
                    },
                    {
                        path: 'patients',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/patients/patients.module'
                            ).then((m) => m.PatientsModule),
                    },
                    {
                        path: 'employees',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/employees/employees.module'
                            ).then((m) => m.EmployeesModule),
                    },
                    {
                        path: 'deliveries',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/deliveries/deliveries.module'
                            ).then((m) => m.DeliveriesModule),
                    },
                    {
                        path: 'inventory-logs',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/inventory-logs/inventory-logs.module'
                            ).then((m) => m.InventoryLogsModule),
                    },
                    {
                        path: 'state-agencies',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/state-agencies/state-agencies.module'
                            ).then((m) => m.StateAgenciesModule),
                    },
                ],
            },
        ],
    },
    {
        path: 'cultivator',
        canActivate: [EmployeeGuard],
        loadChildren: () =>
            import('app/modules/employee/employee.module').then(
                (m) => m.EmployeeModule
            ),
    },
    {
        path: 'tester',
        canActivate: [TesterGuard],
        loadChildren: () =>
            import('app/modules/employee/employee.module').then(
                (m) => m.EmployeeModule
            ),
    },
    {
        path: 'processor',
        canActivate: [ProcessorGuard],
        loadChildren: () =>
            import('app/modules/employee/employee.module').then(
                (m) => m.EmployeeModule
            ),
    },
    {
        path: 'manufacturer',
        canActivate: [ManufacturerGuard],
        loadChildren: () =>
            import('app/modules/manufacturer/manufacturer.module').then(
                (m) => m.ManufacturerModule
            ),
    },
    {
        path: 'disposer',
        canActivate: [DisposalGuard],
        loadChildren: () =>
            import('app/modules/disposal/disposal.module').then(
                (m) => m.DisposalModule
            ),
    },
    {
        path: 'distributor',
        canActivate: [DistributorGuard],
        loadChildren: () =>
            import('app/modules/distributor/distributor.module').then(
                (m) => m.DistributorModule
            ),
    },
    {
        path: 'wellnesscenter',
        canActivate: [WellnessGuard],
        loadChildren: () =>
            import('app/modules/wellness-center/wellness-center.module').then(
                (m) => m.WellnessCenterModule
            ),
    },
    {
        path: 'dispensary',
        canActivate: [DispensaryGuard],
        loadChildren: () =>
            import('app/modules/dispensary/dispensary.module').then(
                (m) => m.DispensaryModule
            ),
    },
    {
        path: 'update-attendance',
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        loadChildren: () =>
            import(
                'app/modules/common/update-attendance/update-attendance.module'
            ).then((m) => m.UpdateAttendanceModule),
    },
];
