import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ButtonDirective} from 'primeng/button';

@Component({
  imports: [RouterLink, ButtonDirective],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
