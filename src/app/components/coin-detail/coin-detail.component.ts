import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.scss',
})
export class CoinDetailComponent {
  coinData: any;
  coin!: string;
  days: number = 1;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Price Trends',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgb(64 64 64)',
        pointBackgroundColor: '#009688',
        pointBorderColor: 'rgb(64 64 64)',
        pointHoverBackgroundColor: 'rgb(64 64 64)',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.coin = val['symbol'];
      this.getCoinData();
    });
  }

  getCoinData() {
    this.apiService.get24hrTickerInfo(this.coin).subscribe((res) => {
      this.coinData = res;
      this.coinData.volume = parseFloat(res.quoteVolume).toFixed(2);
      this.coinData.priceChangePercent = parseFloat(
        res.priceChangePercent
      ).toFixed(2);
      this.coinData.highPrice = parseFloat(res.highPrice).toFixed(2);
      this.coinData.lowPrice = parseFloat(res.lowPrice).toFixed(2);

      this.updateChartData();
    });
  }

  updateChartData() {
    const lastPrice = parseFloat(this.coinData.lastPrice);
    const prevClosePrice = parseFloat(this.coinData.prevClosePrice);

    const currentTime = Date.now();
    const previousTime = currentTime - 24 * 60 * 60 * 1000;

    this.lineChartData.datasets[0].data = [
      { x: previousTime, y: prevClosePrice },
      { x: currentTime, y: lastPrice },
    ];

    this.lineChartData.labels = [
      new Date(previousTime).toLocaleString(),
      new Date(currentTime).toLocaleString(),
    ];

    this.myLineChart.update();
  }
}
