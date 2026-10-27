import { Component, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { RouterLink } from '@angular/router';

registerLocaleData(localeRo);

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  providers: [{ provide: LOCALE_ID, useValue: 'ro-RO' }],
})
export class Home {
  today = new Date();
}
