import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

import { GrowerPlant } from 'app/core/grower/grower.interface';
import { DisplayedPlant } from 'app/core/grower/grower.interface';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { AddPlantsComponent } from '../add-plants/add-plants.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GrowerService } from 'app/core/grower/grower.service';
import { TesterService } from 'app/core/tester/tester.service';

@Component({
    selector: 'app-plants',
    templateUrl: './plants.component.html',
    styleUrls: ['./plants.component.scss'],
})
export class PlantsComponent implements OnInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('sidenav') sideNav: MatSidenav;
    public pageSize = 20;
    public totalResults: number;
    public noRecords: any;
    public viewDetails: any;
    public filterbatchNumber: string;
    public geneticStainTypes: any;
    public filterPlantTest: boolean;
    public filterPlantProcess: boolean;
    public filterCompany: string;
    public userInfo: any;
    dataSource = new MatTableDataSource<GrowerPlant>();
    visibleColumns = DisplayedPlant;
    authServices: any;
    testeractions: boolean = false;

    constructor(
        private growerService: GrowerService,
        private matDialog: MatDialog,
        private testerService: TesterService,
        private snackBar: MatSnackBar
    ) {
        this.userInfo = JSON.parse(localStorage.getItem('userData'));
    }

    ngOnInit(): void {
        this.getPlants();

        console.log(this.userInfo.modelId.employer.businessType);
    }
    getPlants(): void {
        this.paginator.pageSize = this.paginator.pageSize
            ? this.paginator.pageSize
            : 20;

        const pageparams = `?limit=${this.paginator.pageSize}&page=${
            this.paginator.pageIndex + 1
        }`;
        const batchNumber = this.filterbatchNumber
            ? `&batchNumber=${this.filterbatchNumber}`
            : '';
        const geneticCompanyName = this.filterCompany
            ? `&geneticCompany=${this.filterCompany}`
            : '';

        const plantTest = this.filterPlantTest
            ? `&plantTest=${this.filterPlantTest}`
            : '';
        const plantProcess = this.filterPlantProcess
            ? `&plantProcess=${this.filterPlantProcess}`
            : '';
        const totalparams = `${
            pageparams +
            batchNumber +
            plantTest +
            plantProcess +
            geneticCompanyName
        }`;
        if (this.userInfo.modelId.employer.businessType === 'Cultivator') {
            this.growerService.getGrowerPlants(totalparams).subscribe(
                (response: any) => {
                    console.log(response);
                    this.noRecords = response.data.result.results;
                    this.dataSource = response.data.result.results;
                    this.totalResults = response.data.result.totalResults;
                },
                (err: any) => {
                    console.log(err);
                }
            );
        } else {
            this.testerService
                .getTestResultList(totalparams)
                .subscribe((response: any) => {
                    this.noRecords = response.data.plants.results;
                    this.dataSource = response.data.plants.results;
                    this.totalResults = response.data.plants.totalResults;
                });
        }
    }

    sideToggle(event): void {
        this.viewDetails = event;
        console.log(this.viewDetails);
        this.sideNav.toggle();
    }

    filterByBatchNumber(query: string): void {
        this.filterbatchNumber = query;
        this.getPlants();
    }

    filterByCompany(query: string): void {
        this.filterCompany = query;
        this.getPlants();
    }
    toggleplantTest(change: MatSlideToggleChange): void {
        this.filterPlantTest = change.checked;
        this.getPlants();
    }

    toggleplantprocess(change: MatSlideToggleChange): void {
        this.filterPlantProcess = change.checked;
        this.getPlants();
    }
    openPlantDialog(plantData: any) {
        let EditPlant = this.matDialog.open(AddPlantsComponent, {
            autoFocus: false,
            data: {
                plantData: cloneDeep(plantData),
            },
        });
        EditPlant.afterClosed().subscribe((result) => {
            this.getPlants();
        });
    }
    deletePlant(plantId: any) {
        this.growerService.deleteGrowerPlant(plantId).subscribe(
            (res) => {
                console.log(res);
                this.getPlants();
                this.snackBar.open('Plant Deleted Successfully..!', 'Close', {
                    duration: 2000,
                });
            },
            (err: any) => {
                this.snackBar.open(err.error.message, 'Close', {
                    duration: 2000,
                    panelClass: ['alert-red'],
                });
                console.log(err);
            }
        );
    }
}
