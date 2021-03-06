import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiveDosageFormComponent } from './give-dosage-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [GiveDosageFormComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: GiveDosageFormComponent,
            },
        ]),
    ],
})
export class GiveDosageFormModule {}
