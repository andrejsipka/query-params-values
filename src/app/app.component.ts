import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, NonNullableFormBuilder } from '@angular/forms';
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
  private fb = inject(NonNullableFormBuilder);

  private interval$: Observable<number> = interval(10 * 1000);
  private countries$: Observable<Country[]> = this.dataAccess.request();

  public contries: Country[] = [];
  public form: FormGroup = this.fb.group({
    time: [this.setTime()],
    date: [this.setDate()]
  });

  public ngOnInit(): void {
    console.log(this.form.get('date')?.value);
    console.log(this.form.get('time')?.value);

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
}
