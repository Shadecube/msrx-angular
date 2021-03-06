import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDisposaryComponent } from './create-disposary.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlantsDrawerModule } from 'app/modules/common/plants-drawer/plants-drawer.module';

const CreateDisposaryRoutes: Route[] = [
    {
        path: '',
        component: CreateDisposaryComponent,
    },
];

@NgModule({
    declarations: [CreateDisposaryComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(CreateDisposaryRoutes),
        SharedModule,
        PlantsDrawerModule,
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
    ],
})
export class CreateDisposaryModule {}
