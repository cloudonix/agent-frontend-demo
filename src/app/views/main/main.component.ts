import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

import { AppComponent } from 'src/app/app.component';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

	apikeyFormControl = new FormControl('', [
		Validators.required,
	]);
	apikeyCheck = new CheckKeyErrorStateMatcher(this);
	forceCheck:boolean = false;

	constructor(private app:AppComponent, private router:Router) {}

	ngOnInit(): void {}

	public get keyIsValid():boolean {
		return !this.apikeyFormControl.invalid;
	}

	public submitKey():void {
		this.forceCheck = true;
		if (this.apikeyFormControl.invalid) {
			alert("Invalid API Key");
			return;
		}
		this.app.setAPIKey(this.apikeyFormControl.value);
		this.router.navigate(['/manage']);
	}
}

export class CheckKeyErrorStateMatcher implements ErrorStateMatcher {

	constructor(private owner:MainComponent) {}

	isErrorState(control: FormControl | null, form: FormGroupDirective | null):any {
		let val = control?.value.trim();
		if (!val && !this.owner.forceCheck)
			return null;
		return !(val && val.match(/^XI/) && val.length == 34);
	}
}
