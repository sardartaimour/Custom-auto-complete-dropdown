import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
	title = 'auto-complete-dropdown';
	selectedCar: any = 4;

	onCheckValue(): void
	{
		console.log('Control value => ', this.selectedCar)
	}
}
