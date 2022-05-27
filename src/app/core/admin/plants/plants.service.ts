import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { adminUrls } from '../urls';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class PlantsService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getplantsDetails(limit: number, page: number) {
        let options = {
            params: {
                limit,
                page,
            },
        };
        return this.http.get<any>(adminUrls.plants, options);
    }
}