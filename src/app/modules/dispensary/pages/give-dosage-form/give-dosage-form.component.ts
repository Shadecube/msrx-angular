import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductI } from 'app/core/common/common.interface';
import { CommonService } from 'app/core/common/common.service';
import { DispensaryService } from 'app/core/dispensary/dispensary.service';
import { Location } from '@angular/common';
import { ScanMorePlantsComponent } from 'app/modules/common/scan-more-plants/scan-more-plants.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-give-dosage-form',
    templateUrl: './give-dosage-form.component.html',
    styleUrls: ['./give-dosage-form.component.scss'],
})
export class GiveDosageFormComponent implements OnInit {
    @ViewChild('scanQRCodeDialog') scanQRCodeDialog: TemplateRef<any>;
    scannedProductIDs: {
        productID: string;
        quantity: number;
        product: ProductI;
    }[] = [];

    productID;
    quantityDialog: boolean = false;
    productData: any;
    quantity: number;
    constructor(
        private dialog: MatDialog,
        private commonService: CommonService,
        private snackBar: MatSnackBar,
        private dispensaryService: DispensaryService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {}

    productDetails() {
        this.commonService.getCommonProductDetails(this.productID).subscribe(
            (res: any) => {
                this.productID = '';
                console.log('res', res);
                if (!res.data.product) {
                    this.snackBar.open('Invalid Product', 'Close', {
                        duration: 3000,
                        panelClass: ['alert-red'],
                    });
                } else {
                    this.productData = res.data.product;
                    this.quantityDialog = true;
                }
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 3000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
            }
        );
    }
    showScanMenu() {
        this.dialog.open(this.scanQRCodeDialog);
    }
    matClose() {
        this.dialog.closeAll();
    }
    presentScanAction(): void {
        const dialogRef = this.dialog.open(ScanMorePlantsComponent, {});
        dialogRef.afterClosed().subscribe((result) => {
            this.productID = result;
            // this.addPlant();
            console.log(result);
        });
    }
    addMaterial() {
        this.quantityDialog = false;

        const qty = this.quantity;
        if (qty) {
            this.scannedProductIDs.push({
                productID: this.productData._id,
                product: this.productData,
                quantity: this.quantity,
            });
        }
        this.dialog.closeAll();
    }
    saveDosage() {
        if (this.scannedProductIDs.length === 0) {
            this._fuseConfirmationService.open({
                title: 'Error',
                message: 'Products  details not found...!',
                actions: {
                    confirm: {
                        show: false,
                    },
                    cancel: {
                        show: true,
                        label: 'Cancel',
                    },
                },
            });
            return;
        }
        this.dispensaryService
            .saveDosage(
                this.activatedRoute.snapshot.queryParams.prescriptionID,
                {
                    products: this.scannedProductIDs.map((p) => ({
                        product: p.productID,
                        quantity: p.quantity,
                    })),
                }
            )
            .subscribe((res: any) => {
                console.log(res);
                this.snackBar.open('Inventory Added', 'Close', {
                    duration: 4000,
                });
                this.location.back();
            });
    }
}
