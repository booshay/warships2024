import { Routes } from '@angular/router';
import { QueryComponent } from './query/query.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RelicsComponent } from './relics/relics.component';
import { RssComponent } from './rss/rss.component';
import { MinesComponent } from './mines/mines.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'query', component: QueryComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'relics', component: RelicsComponent },
    { path: 'rss', component: RssComponent },
    { path: 'mines', component: MinesComponent }
];
