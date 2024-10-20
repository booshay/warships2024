import { Routes } from '@angular/router';
import { QueryComponent } from './query/query.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RelicsComponent } from './relics/relics.component';
import { RssComponent } from './rss/rss.component';
import { MinesComponent } from './mines/mines.component';
import { jwtGuard } from './jwt.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { coordsResolverResolver } from './coords-resolver.resolver';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'query', component: QueryComponent, canActivate: [jwtGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'relics', component: RelicsComponent, canActivate: [jwtGuard] },
    { path: 'rss', component: RssComponent, canActivate: [jwtGuard] },
    {
        path: 'mines', component: MinesComponent, canActivate: [jwtGuard], resolve: {
            mineData: coordsResolverResolver
        }
    }
];
