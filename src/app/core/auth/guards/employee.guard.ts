import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmployeeGuard implements CanActivate {
    getUser: any;
    constructor(private router: Router) {
        this.getUser = JSON.parse(localStorage.getItem('userData'));
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.checkEmployee();
    }

    checkEmployee(): boolean {
        if (
            this.getUser &&
            this.getUser.modelId.employer.businessType == 'Employee'
        ) {
            console.log('employee');
            return true;
        } else {
            if (this.getUser) {
                let role = this.getUser.modelId.employer.businessType;
                let redirect = role.toLowerCase();
                this.router.navigateByUrl(`/${redirect}/dashboard`);
            } else if (this.getUser) {
                let role = this.getUser.modelId.employer.businessType;
                let redirect =
                    role.toLowerCase() == 'tester'
                        ? 'tester'
                        : role.toLowerCase();

                this.router.navigateByUrl(`/${redirect}/dashboard`);
            }

            return false;
        }
    }
}