import { Routes } from '@angular/router';
import { CryptoListComponent } from './components/crypto-list/crypto-list.component';
import { CoinDetailComponent } from './components/coin-detail/coin-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/coin-list', pathMatch: 'full' },
  { path: 'coin-list', component: CryptoListComponent },
  { path: 'coin-detail/:symbol', component: CoinDetailComponent },
];
