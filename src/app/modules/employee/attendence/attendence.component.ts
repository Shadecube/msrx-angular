import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    OnInit,
} from '@angular/core';

import { CalendarEvent, CalendarView } from 'angular-calendar';
import moment from 'moment';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};
import { ChartComponent, ChartType } from 'ng-apexcharts';

import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
} from 'ng-apexcharts';

import { EmployeeAdminService } from 'app/core/employee-admin/employee-admin.service';
import { EmployeeI } from 'app/core/auth/auth.interface';
import { AttendanceService } from 'app/core/attendance/attendance.service';
import { AuthService } from 'app/core/auth/auth.service';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
};

@Component({
    selector: 'app-attendence',
    templateUrl: './attendence.component.html',
    styleUrls: ['./attendence.component.scss'],
})
export class AttendenceComponent implements OnInit {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    employeesList: EmployeeI[] = [];
    events: CalendarEvent[] = [];
    selectedEmployee: EmployeeI;
    workingDays = 0;
    leaveDays = 0;
    notWorkingDays = [6, 0];
    isAdmin = false;

    constructor(
        private employeeService: EmployeeAdminService,
        private attendanceService: AttendanceService,
        private authService: AuthService
    ) {
        this.isAdmin = this.authService.isAdmin();
    }

    ngOnInit(): void {
        if (this.isAdmin) {
            this.getAdminAttendance();
        } else {
            this.getAttendance();
        }
        // this.getAdminAttendance();
        // this.updateChart(this.workingDays, this.leaveDays);
    }

    changeEmploye(event) {
        this.selectedEmployee = event;
        this.getAttendance();
    }

    getAdminAttendance() {
        this.employeeService.getEmployees().subscribe((res) => {
            this.employeesList = res.data.employees.results;
            this.selectedEmployee = this.employeesList[0];
            this.getAttendance();
        });
    }

    async getAttendance() {
        let empID = this.authService.userRole?.modelId._id;
        if (this.selectedEmployee) {
            empID = this.selectedEmployee._id;
        }
        const openedMonth = moment(this.viewDate);
        console.log(this.viewDate);
        const start = openedMonth.startOf('month').get('date');
        const end = openedMonth.endOf('month').get('date');
        console.log('start', start, end);
        this.attendanceService
            .getAttendance(
                empID,
                openedMonth.startOf('month').format('YYYY-MM-DD'),
                openedMonth.endOf('month').format('YYYY-MM-DD')
            )
            .subscribe(
                (res) => {
                    const savedAttendance = new Set<string>(
                        res.data.attendances.results.map((a: any) =>
                            moment(a.createdAt).format('D-MM-YYYY')
                        )
                    );
                    const localEvents = [];
                    let workingDays = 0;
                    let leaveDays = 0;

                    for (let index = start; index <= end; index++) {
                        const iterDate = `${index}-${openedMonth.format(
                            'MM'
                        )}-${openedMonth.format('YYYY')}`;
                        const leaveDate = openedMonth
                            .clone()
                            .set('date', index);
                        if (!savedAttendance.has(iterDate)) {
                            if (
                                this.notWorkingDays.includes(
                                    leaveDate.weekday()
                                )
                            ) {
                                continue;
                            }
                            leaveDays++;
                            localEvents.push({
                                start: leaveDate.toDate(),
                                title: 'Leave on ' + iterDate,
                                color: {
                                    primary: '#eb445a',
                                    secondary: '#ffc409',
                                },
                                cssClass: 'leave-' + iterDate,
                                end: leaveDate.toDate(),
                            });
                        } else {
                            console.log('Was working on', iterDate);
                            workingDays++;
                        }
                    }

                    this.events = localEvents;
                    this.updateChart(workingDays, leaveDays);
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    updateChart(workingDays: number, leaveDays: number) {
        this.chartOptions = {
            series: [workingDays, leaveDays],
            chart: {
                type: 'donut' as ChartType,
            },
            labels: ['Working', 'Leave'],
            colors: ['#70d800', '#eb445a'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        };
    }

    addMockEvents() {
        this.events.push({
            start: moment().subtract(2, 'day').toDate(),
            title: 'Leave',
            color: {
                primary: '#eb445a',
                secondary: '#ffc409',
            },
            cssClass: 'leave',
            end: moment().subtract(2, 'day').toDate(),
        });
    }
}
