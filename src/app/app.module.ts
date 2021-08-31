import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { ManagementComponent } from './views/management/management.component';
import { DispatchComponent } from './views/dispatch/dispatch.component';

@NgModule({
	imports: [
		BrowserModule, HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule, FormsModule, ReactiveFormsModule,
		MatToolbarModule, MatIconModule, MatMenuModule, MatInputModule, MatFormFieldModule,
		MatCardModule, MatButtonModule, MatSelectModule,
	],
	declarations: [
		AppComponent,
		MainComponent,
  ManagementComponent,
  DispatchComponent,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
