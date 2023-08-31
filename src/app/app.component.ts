import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap, interval, Observable } from 'rxjs';
import { DataAccess } from './data-access.service';

type Country = {
  name: string,
  value: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Query Params playground';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataAccess = inject(DataAccess);

  private interval$: Observable<number> = interval(10 * 1000);
  private countries$: Observable<Country[]> = this.dataAccess.request();

  public contries: Country[] = [];

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      switchMap(() => this.route.queryParams)
    ).subscribe({
      next: (params) => {
        console.log(params);
        this.getCountries();
      }
    })
  }

  private getCountries(): void {
    this.countries$.subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err: Error) => {
        console.log(err.message);
      }
    })
  }
}
