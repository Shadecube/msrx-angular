import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateWellnessProfileComponent } from './update-wellness-profile.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
    declarations: [UpdateWellnessProfileComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: UpdateWellnessProfileComponent,
            },
        ]),
        SharedModule,
        NgxMaterialTimepickerModule.setLocale('de-DE'),
    ],
})
export class UpdateWellnessProfileModule {}
