import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {CardModule} from 'primeng/card';
import { EfallComponent } from './core/efall/efall.component';
import { MainComponent } from './core/efall/main/main.component';
import { HeaderComponent } from './core/efall/header/header.component';
import { FooterComponent } from './core/efall/footer/footer.component';
import { NotFoundComponent } from './core/efall/not-found/not-found.component';
const routes: Routes = [
  { path: '', component: EfallComponent },
  { path: 'efall', component: EfallComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  declarations: [
    AppComponent,
    EfallComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    CardModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
