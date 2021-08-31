import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';

interface Domain {
	domain:string;
}

interface Session {
	token:string;
	status:string;
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'demo-agent-in-conference';
	private apiKey:string = '';
	private baseUrl = "https://api.cloudonix.io";
	errorMessage:string = '';
	private _errorTime = 0;
	private _domain:string = '';
	private _agentSession = '';
	private _currentCall = '';
	private _agentSessionMonitor:Subscription|null = null;
	private _customerSessionMonitor:Subscription|null = null;
	private _agentConnected = false;

	constructor(private http:HttpClient, private router:Router) {
		router.events.subscribe(e => {
			if (e instanceof NavigationStart && this.errorMessage && (this._errorTime + 2000 < Date.now())) {
				this.errorMessage = '';
			}
		});
		this.apiKey = window.localStorage.getItem('apiKey') ?? '';
		this._domain = window.localStorage.getItem('domain') ?? '';
		this._agentSession = window.localStorage.getItem('agent-session') ?? '';
		if (this._agentSession)
			this.startMonitoringAgent();
	}

	restartApplication():void {
		this.apiKey = '';
		this._domain = '';
		this._agentSession = '';
		window.localStorage.removeItem('apiKey');
		window.localStorage.removeItem('domain');
		window.localStorage.removeItem('agent-session');
		this.router.navigate(['/']);
	}

	changeDomain():void {
		this._domain = '';
		this._agentSession = '';
		window.localStorage.removeItem('domain');
		window.localStorage.removeItem('agent-session');
		this.router.navigate(['/manage']);
	}

	public setError(message:string):void {
		console.error("Application error:", message);
		this.errorMessage = message;
		this._errorTime = Date.now();
	}

	public setAPIKey(key:string):void {
		this.apiKey = key;
		window.localStorage.setItem('apiKey', this.apiKey);
	}

	public set domain(domain:string) {
		this._domain = domain;
		window.localStorage.setItem('domain', this._domain);
	}

	public get domain():string {
		return this._domain;
	}

	public get waitingForAgent():boolean {
		return !!this._agentSession && !this._agentConnected;
	}

	public get inCall():boolean {
		return !!this._currentCall;
	}

	private get authHeaders():HttpHeaders {
		return new HttpHeaders({ Authorization: `Bearer ${this.apiKey}` });
	}

	public listDomains():Promise<Domain[]> {
		return this.http.get<Domain[]>(`${this.baseUrl}/domains`, { headers: this.authHeaders, responseType: 'json'}).toPromise();
	}

	public startAgent(msisdn:string):void {
		this.connectToConference(msisdn, 'myconf-call-1', false).then(session => {
			console.log("started agent", msisdn, "session", session.token);
			this._agentSession = session.token;
			window.localStorage.setItem('agent-session', session.token);
			this.router.navigate(['/dispatch']);
			this.startMonitoringAgent();
		}).catch(this.handleAgentError);
	}

	public handleAgentError(err:Error):void {
		this.setError("Error creating agent session! " + err.message);
		this.restartApplication();
	}

	public endSession():void {
		this._agentSessionMonitor?.unsubscribe();
		this._agentSessionMonitor = null;
		this._agentConnected = false;
		this.disconnectSession(this._agentSession).then(response => {
			console.log("Agent session", this._agentSession, "ended", response);
			this._agentSession = '';
			window.localStorage.removeItem('agent-session');
			this.router.navigate(['/manage']);
		}).catch(this.handleAgentError);
	}

	public connectCustomer(msisdn:string):void {
		this.errorMessage = '';
		this.connectToConference(msisdn, 'myconf-call-1', true).then(session => {
			console.log("Started customer call", msisdn, "-", session.token);
			this._currentCall = session.token;
			this.startMonitoringCustomer();
		}).catch(err => {
			this.endSession();
			this.handleAgentError(err);
		})
	}

	public disconnectCustomer():void {
		this._customerSessionMonitor?.unsubscribe();
		this._customerSessionMonitor = null;
		this.disconnectSession(this._currentCall).then(() => {
			console.log("Disconnected customer call", this._currentCall);
			this._currentCall = '';
		}).catch(err => {
			this._currentCall = '';
			this.endSession();
			this.handleAgentError(err);
		});
	}

	private startMonitoringAgent():void {
		this._agentSessionMonitor = interval(2000).subscribe(v => {
			this.getSession(this._agentSession).then(session => {
				switch (session.status) {
					case 'connected':
						this._agentConnected = true;
					case 'new':
					case 'ringing':
						break;
					default:
						this.setError(`Agent session terminated unexpectedly (status: ${session.status})`);
						this.endSession();
				}
			}).catch(e => {
				this.setError("Agent session error: " + e.message);
				this.disconnectCustomer();
				this.endSession();
			});
		});
	}

	private startMonitoringCustomer():void {
		this._customerSessionMonitor = interval(2000).subscribe(v => {
			this.getSession(this._currentCall).then(session => {
				switch (session.status) {
					case 'connected':
					case 'new':
					case 'ringing':
						break;
					case 'busy':
						this.setError("Customer rejected the call");
					case 'answer':
						this.disconnectCustomer(); // the session has closed correctly by the customer
						break;
					default:
						this.setError(`Customer terminated unexpectedly (status: ${session.status})`);
						this.disconnectCustomer();
				}
			}).catch(e => {
				this.setError("Customer session error: " + e.message);
				this.disconnectCustomer();
				this.endSession();
			});
		});
	}

	private connectToConference(destination:string, name:string, immediate:boolean):Promise<Session> {
		let request = {
			callerId: "1234",
			destination: destination,
			cxml: `<Response><Dial><Conference beep="false">${name}</Conference></Dial></Response>`,
			execute: immediate ? 'immediately' : 'connected'
		};
		return this.http.post<Session>(`${this.baseUrl}/calls/${this.domain}/application`, request, {
			headers: this.authHeaders.append('Content-Type', 'application/json'),
			responseType: 'json'
		})
		.toPromise();
	}

	private disconnectSession(session:string):Promise<void> {
		return this.http.delete(`${this.baseUrl}/calls/${this.domain}/sessions/${session}`, {
			headers: this.authHeaders
		}).toPromise().then(() => {});
	}

	private getSession(session:string):Promise<Session> {
		return this.http.get<Session>(`${this.baseUrl}/calls/${this.domain}/sessions/${session}`, {
			headers: this.authHeaders
		}).toPromise();
	}
}
