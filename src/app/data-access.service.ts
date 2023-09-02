import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

type Country = {
  name: string,
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class DataAccess {
  public data = [
    {
      "name": "Bermuda",
      "value": 57493
    },
    {
      "name": "Chad",
      "value": 32289
    },
    {
      "name": "Norway",
      "value": 30054
    },
    {
      "name": "Sao Tome and Principe",
      "value": 17086
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "value": 25076
    },
    {
      "name": "Guernsey",
      "value": 46918
    },
    {
      "name": "Indonesia",
      "value": 51086
    },
    {
      "name": "Åland Islands",
      "value": 55414
    },
    {
      "name": "Sri Lanka",
      "value": 55499
    },
    {
      "name": "European Union",
      "value": 12257
    },
    {
      "name": "Ukraine",
      "value": 51808
    },
    {
      "name": "Afghanistan",
      "value": 11024
    },
    {
      "name": "Croatia",
      "value": 20860
    },
    {
      "name": "Latvia",
      "value": 23011
    },
    {
      "name": "Bangladesh",
      "value": 47368
    },
    {
      "name": "Belgium",
      "value": 21105
    },
    {
      "name": "Åland Islands",
      "value": 13878
    },
    {
      "name": "Lithuania",
      "value": 17079
    },
    {
      "name": "Canada",
      "value": 54530
    },
    {
      "name": "Italy",
      "value": 48070
    }
  ];

  constructor() { }

  private getRandomObj(arr: any[]): Country {
    const randomNum = Math.floor(Math.random() * (arr.length - 0));
    return arr[randomNum];
  }

  private randomContries(data: Country[], number: number): Country[] {
    let results: Country[] = [];

    // Loop over n times and get random country
    for(let i = 0; i < number; i++) {
      results.push(this.getRandomObj(data));
    }

    return results;
  }

  public request(number: number): Observable<Country[]> {
    return of(this.data).pipe(
      map((data) => this.randomContries(data, 7))
    );
  }
}
