import { Component, Input, OnInit } from '@angular/core';
import { MetricService } from 'app/core/metric-module/metric.service';

@Component({
  selector: 'clark-ncyte-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @Input() collectionName: string;
  name: string;

  objDownload: number;
  objReview: number;
  objReleased: number;
  objSaved: number;
  authorCollection: number;

  constructor(private metricService: MetricService) { }

  async ngOnInit() {
    switch (this.collectionName) {
      case 'nice':
        this.name = 'NICE';
        break;
      case 'ncyte':
        this.name = 'NCyTE';
        break;
    }

    await this.metricService.getCollectionMetrics(this.collectionName).then((res: any) => {
      this.objDownload = res.metrics.downloads;
      this.objSaved = res.metrics.saves;
      this.objReleased = res.metrics.statusMetrics[0].released;
      const num = res.metrics.statusMetrics[0].waiting + res.metrics.statusMetrics[0].peerReview + res.metrics.statusMetrics[0].proofing;
      this.objReview = num;
      this.authorCollection = res.metrics.authors.length;
    });
  }

}
