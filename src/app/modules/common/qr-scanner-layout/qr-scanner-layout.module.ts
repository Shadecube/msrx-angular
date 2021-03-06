import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrScannerLayoutComponent } from './qr-scanner-layout.component';
import { Route, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';

import { ProductDrawerModule } from '../product-drawer/product-drawer.module';
import { PlantsDrawerModule } from '../plants-drawer/plants-drawer.module';
import { PrescriptionsDrawerModule } from '../prescriptions-drawer/prescriptions-drawer.module';

const routes: Route[] = [
    {
        path: '',
        component: QrScannerLayoutComponent,
    },
];

@NgModule({
    declarations: [QrScannerLayoutComponent],
    imports: [
        CommonModule,
        MatSelectModule,
        RouterModule.forChild(routes),
        SharedModule,
        PlantsDrawerModule,
        ProductDrawerModule,
        PrescriptionsDrawerModule,
    ],
})
export class QrScannerLayoutModule {}
