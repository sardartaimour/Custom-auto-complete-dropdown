import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { AppComponent } from './app.component';
import { AutoCompleteDpComponent } from './auto-complete-dp/auto-complete-dp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
	declarations: [
		AppComponent,
		AutoCompleteDpComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		OverlayModule,
		PortalModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
