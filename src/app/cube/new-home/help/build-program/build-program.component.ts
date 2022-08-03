import { Component, OnInit} from '@angular/core';
import { GuidelineService } from 'app/core/guideline.service';
import { BuildProgramComponentService } from 'app/cube/core/build-program-component.service';
import { FrameworkDocument } from 'entity/standard-guidelines/Framework';
import { SearchItemDocument } from 'entity/standard-guidelines/search-index';

@Component({
  selector: 'clark-build-program',
  templateUrl: './build-program.component.html',
  styleUrls: ['./build-program.component.scss']
})
export class BuildProgramComponent implements OnInit {
  frameworks: FrameworkDocument[];
  currentFramework: string;
  currentFrameworkGuidelines: SearchItemDocument[];

  constructor(private buildProgramComponentService: BuildProgramComponentService,
              private guidelineService: GuidelineService) { }

  ngOnInit(): void {
    this.buildProgramComponentService.currentFrameworkObservable
    .subscribe(framework => {
      this.currentFramework = framework;
    });
    this.guidelineService.getFrameworks({ limit: 100, page: 1 })
    .then(result => {
      this.frameworks = result;
    });
  }

  handleFrameworkClicked(event: string) {
    this.buildProgramComponentService.updateCurrentFramework(event);
    this.guidelineService.getGuidelines({
      frameworks: this.currentFramework
    })
    .then(result => {
      this.currentFrameworkGuidelines = result.results;
    });
  }
}
