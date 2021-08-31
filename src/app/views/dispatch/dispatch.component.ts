import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';

@Component({
	selector: 'app-dispatch',
	templateUrl: './dispatch.component.html',
	styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit {

	customerMsisdn = new FormControl('', [
		Validators.required,
		Validators.minLength(4),
	]);

	constructor(private app:AppComponent) {}

	ngOnInit(): void {}

	public get waitingForAgent(): boolean {
		return this.app.waitingForAgent;
	}

	public get isInCall():boolean {
		return this.app.inCall;
	}

	public callCustomer():void {
		this.app.connectCustomer(this.customerMsisdn.value);
	}

	public hangupCustomer() {
		this.app.disconnectCustomer();
	}

	public endSession():void {
		this.app.endSession();
	}
}
