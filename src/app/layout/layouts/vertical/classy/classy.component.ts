import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { MatDialog } from '@angular/material/dialog';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { th } from 'date-fns/locale';
import { AuthService } from 'app/core/auth/auth.service';
import {
    cultivatorNavigation,
    defaultNavigation,
    dispensaryNavigation,
    disposalNavigation,
    distributorNavigation,
    manufacturerNavigation,
    processorNavigation,
    TesterNavigation,
    wellnessCenterNavigation,
} from 'app/mock-api/common/navigation/data';
import { CommonService } from 'app/core/common/common.service';
import { genereateQRCode, getBusinessType } from 'app/shared/shared.utils';
import { BusinessTypeEnums, QRType } from 'app/shared/shared.enums';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    public userDetails: any;
    public role: any;
    scanQRForm: FormGroup;
    plantId: string;
    filterPlantId: string = null;
    base64Image: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('scanQRCodeDialog') scanQRCodeDialog: TemplateRef<any>;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private dialog: MatDialog,
        private router: Router,
        private authService: AuthService,
        private commonService: CommonService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.scanQRForm = new FormGroup({
            planId: new FormControl(null, Validators.required),
        });
        this.role = this.authService.userRole;

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
                if (this.role.onModel === 'Admin') {
                    this.navigation.compact = defaultNavigation;
                } else if (
                    this.role.modelId.employer?.businessType === 'Tester'
                ) {
                    this.navigation.compact = TesterNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'Processor'
                ) {
                    this.navigation.compact = processorNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'Manufacturer'
                ) {
                    this.navigation.compact = manufacturerNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'Disposer'
                ) {
                    this.navigation.compact = disposalNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'Distributor'
                ) {
                    this.navigation.compact = distributorNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'WellnessCenter'
                ) {
                    this.navigation.compact = wellnessCenterNavigation;
                } else if (
                    this.role.modelId.employer.businessType === 'Dispensary'
                ) {
                    this.navigation.compact = dispensaryNavigation;
                }
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
    openDialog() {
        this.dialog.open(this.scanQRCodeDialog);
    }
    matClose() {
        this.dialog.closeAll();
    }
    plantDetails() {
        if (this.scanQRForm.invalid) {
            return;
        }
        setTimeout(() => {
            this.scanQRForm.reset();
        }, 2000);

        this.commonService.$testPantID.next(this.scanQRForm.value.planId);
        if (this.role.modelId.employer?.businessType === 'Cultivator') {
            this.router.navigate(['/cultivator/test-details'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (this.role.modelId.employer?.businessType === 'Tester') {
            this.router.navigate(['/tester/test-details'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (this.role.modelId.employer?.businessType === 'Processor') {
            this.router.navigate(['/processor/test-details'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (
            this.role.modelId.employer?.businessType === 'Manufacturer'
        ) {
            this.router.navigate(['/manufacturer/add-manufactured-good'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (this.role.modelId.employer?.businessType === 'Disposer') {
            this.router.navigate(['/disposer/test-details'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (this.role.modelId.employer?.businessType === 'Distributor') {
            this.router.navigate(['/distributor/test-details'], {
                queryParams: {
                    plantID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (
            this.role.modelId.employer?.businessType === 'WellnessCenter'
        ) {
            this.router.navigate(['/wellnesscenter/prescription-details'], {
                queryParams: {
                    patientID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        } else if (this.role.modelId.employer?.businessType === 'Dispensary') {
            this.router.navigate(['/dispensary/prescription-details'], {
                queryParams: {
                    patientID: this.scanQRForm.value.planId,
                },
                replaceUrl: true,
            });
        }

        this.dialog.closeAll();
    }
    presentScanAction() {
        if (this.role.modelId.employer?.businessType === 'Cultivator') {
            this.router.navigateByUrl('/cultivator/qr-scanner-layout');
        } else if (this.role.modelId.employer?.businessType === 'Tester') {
            this.router.navigateByUrl('/tester/qr-scanner-layout');
        } else if (this.role.modelId.employer?.businessType === 'Processor') {
            this.router.navigateByUrl('/processor/qr-scanner-layout');
        } else if (
            this.role.modelId.employer?.businessType === 'Manufacturer'
        ) {
            this.router.navigateByUrl('/manufacturer/qr-scanner-layout');
        } else if (this.role.modelId.employer?.businessType === 'Disposer') {
            this.router.navigateByUrl('/disposer/qr-scanner-layout');
        } else if (this.role.modelId.employer?.businessType === 'Distributor') {
            this.router.navigateByUrl('/distributor/qr-scanner-layout');
        } else if (
            this.role.modelId.employer?.businessType === 'WellnessCenter'
        ) {
            this.router.navigateByUrl('/wellnesscenter/qr-scanner-layout');
        } else if (this.role.modelId.employer?.businessType === 'Dispensary') {
            this.router.navigateByUrl('/dispensary/qr-scanner-layout');
        }

        this.dialog.closeAll();
    }
    showAttendanceCode() {
        const qr = genereateQRCode(
            QRType.EMPLOYEE_ATTENDANCE,
            this.role.modelId._id
        );
        qr.toDataURL();
        const imageUrl = qr.toDataURL();
        this.getBase64ImageFromURL(imageUrl).subscribe((base64data) => {
            this.base64Image = 'data:image/jpg;base64,' + base64data;
            const link = document.createElement('a');
            document.body.appendChild(link); // for Firefox
            link.setAttribute('href', this.base64Image);
            link.setAttribute('download', `Attendance QR Code.png`);
            link.click();
        });
    }

    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            const img: HTMLImageElement = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        });
    }

    getBase64Image(img: HTMLImageElement) {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL: string = canvas.toDataURL('image/png');

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }
}
