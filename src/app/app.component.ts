import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { filter, switchMap, interval, timer, Observable, tap, take, timeInterval, mergeMap, startWith } from 'rxjs';
import { DataAccess } from './data-access.service';

enum FormKeys {
  OPTION = 'option'
}

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
  private fb = inject(NonNullableFormBuilder);

  private interval$: Observable<number> = timer(500, 10 * 1000);
  private countries$: Observable<Country[]> = this.interval$.pipe(
    timeInterval(),
    mergeMap(() => this.dataAccess.request(this.form.get(FormKeys.OPTION)?.value))
  )

  public options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  public contries: Country[] = [];
  public form: FormGroup = this.fb.group({
    time: [this.setTime()],
    date: [this.setDate()],
    option: [this.options[0]]
  });

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      switchMap(() => this.route.queryParams.pipe(
        take(1)
      ))
    ).subscribe({
      next: (params: Params) => {
        this.validateParams(params);
        this.getCountries();
      }
    })
  }

  private getCountries(): void {
    this.countries$.subscribe({
      next: (data) => {
        this.contries = data;
        console.log(this.contries);
      },
      error: (err: Error) => {
        console.log(err.message);
      }
    })
  }

  public setTime(): string {
   return `${new Date().getHours()}:${new Date().getMinutes()}`
  };

  public setDate(): string {
    const currDate = new Date();
    const year = currDate.getFullYear();
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const day = String(currDate.getDate()).padStart(2, '0');

    return [year, month, day].join('-');
  };

  public onSelectChange(e: Event): void {
    const selected = (e.target as HTMLSelectElement).value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { option: selected },
      queryParamsHandling: 'merge'
    })
  }

  public validateParams(params: Params): void {
    if(params.hasOwnProperty('option')) {
      this.form.patchValue({
        option: params['option']
      })
    }
  }
}
