import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './views/main/main.component';
import { ManagementComponent } from './views/management/management.component';
import { DispatchComponent } from './views/dispatch/dispatch.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
	},
	{
		path: 'manage',
		component: ManagementComponent,
	},
	{
		path: 'dispatch',
		component: DispatchComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
