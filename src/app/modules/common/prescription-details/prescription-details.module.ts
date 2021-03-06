import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionDetailsComponent } from './prescription-details.component';
import { SharedModule } from 'app/shared/shared.module';
import { PrescriptionsDrawerModule } from '../prescriptions-drawer/prescriptions-drawer.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [PrescriptionDetailsComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: PrescriptionDetailsComponent,
            },
        ]),
        PrescriptionsDrawerModule,
    ],
})
export class PrescriptionDetailsModule {}
