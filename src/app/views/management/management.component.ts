import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

import { AppComponent } from 'src/app/app.component';

@Component({
	selector: 'app-management',
	templateUrl: './management.component.html',
	styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit, AfterViewInit {
	domains: string[] = [];
	agentMsisdn = new FormControl('', [
		Validators.required,
		Validators.minLength(4),
	]);

	constructor(private app:AppComponent, private router:Router) { }

	ngOnInit(): void {}

	ngAfterViewInit():void {
		this.app.listDomains().then(domains => {
			if (domains.length == 1) {
				this.app.domain = domains[0].domain;
			} else {
				this.domains = domains.map(d => d.domain).sort();
			}
		}).catch(err => {
			if (err.status === 401) {
				this.app.setError("Invalid API Key!");
				this.router.navigate(['/']);
			} else {
				alert(`Unexpected error loading domains: ${err.status} ${err.statusText}`);
			}
		});
	}

	public get needToSelectDomain(): boolean {
		return !this.app.domain;
	}

	public get readyToStart():boolean {
		return !!this.app.domain && !this.app.waitingForAgent;
	}

	public selectDomain(e:MatSelectChange):void {
		this.app.domain = e.value;
	}

	get domain():string {
		return this.app.domain;
	}

	public startAgent():void {
		this.app.startAgent(this.agentMsisdn.value);
	}
}
