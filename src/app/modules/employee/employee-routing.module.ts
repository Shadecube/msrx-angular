import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

const routes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import(
                        'app/modules/employee/dashboard/dashboard.module'
                    ).then((m) => m.DashboardModule),
            },
            {
                path: 'plants',
                loadChildren: () =>
                    import('app/modules/employee/plants/plants.module').then(
                        (m) => m.PlantsModule
                    ),
            },
            {
                path: 'add-plants',
                loadChildren: () =>
                    import(
                        'app/modules/employee/add-plants/add-plants.module'
                    ).then((m) => m.AddPlantsModule),
            },
            {
                path: 'attendence',
                loadChildren: () =>
                    import(
                        'app/modules/employee/attendence/attendence.module'
                    ).then((m) => m.AttendenceModule),
            },
            {
                path: 'employees',
                loadChildren: () =>
                    import(
                        'app/modules/employee/employees/employees.module'
                    ).then((m) => m.EmployeesModule),
            },
            {
                path: 'test-details',
                loadChildren: () =>
                    import(
                        'app/modules/employee/test-details/test-details.module'
                    ).then((m) => m.TestDetailsModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeRoutingModule {}