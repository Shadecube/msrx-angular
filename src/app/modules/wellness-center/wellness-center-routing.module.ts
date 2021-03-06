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
                        'app/modules/wellness-center/pages/dashboard/dashboard.module'
                    ).then((m) => m.DashboardModule),
            },
            {
                path: 'wellness-center-details',
                loadChildren: () =>
                    import(
                        'app/modules/wellness-center/pages/wellness-center-details/wellness-center-details.module'
                    ).then((m) => m.WellnessCenterDetailsModule),
            },
            {
                path: 'update-wellness-profile',
                loadChildren: () =>
                    import(
                        'app/modules/wellness-center/pages/update-wellness-profile/update-wellness-profile.module'
                    ).then((m) => m.UpdateWellnessProfileModule),
            },
            {
                path: 'booking-listing',
                loadChildren: () =>
                    import(
                        'app/modules/wellness-center/pages/booking-listing/booking-listing.module'
                    ).then((m) => m.BookingListingModule),
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
                path: 'prescription-details',
                loadChildren: () =>
                    import(
                        'app/modules/common/prescription-details/prescription-details.module'
                    ).then((m) => m.PrescriptionDetailsModule),
            },
            {
                path: 'qr-scanner-layout',
                loadChildren: () =>
                    import(
                        'app/modules/common/qr-scanner-layout/qr-scanner-layout.module'
                    ).then((m) => m.QrScannerLayoutModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WellnessCenterRoutingModule {}
