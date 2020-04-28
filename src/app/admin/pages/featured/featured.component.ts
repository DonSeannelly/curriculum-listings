import { Component, OnInit } from '@angular/core';
import { LearningObject } from '@entity';
import { FeaturedObjectsService } from 'app/core/featuredObjects.service';
import { LearningObjectService } from 'app/cube/learning-object.service';
import { Query } from 'app/interfaces/query';
import { ToastrOvenService } from 'app/shared/modules/toaster/notification.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'clark-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
  providers: [LearningObjectService]
})
export class FeaturedComponent implements OnInit {
  // Object Arrays
  learningObjects: LearningObject[];
  featuredObjects;

  // Error states
  mutationError;
  submitError;


  // Query for retrieve
  query: Query = {
    limit: 20,
    status: [LearningObject.Status.RELEASED]
  };
  saveError: boolean;
  constructor(
    private featureService: FeaturedObjectsService,
    private toaster: ToastrOvenService,
  ) { }

  async ngOnInit() {
    this.featuredObjects = this.featureService.featuredObjects;
    await this.featureService.getFeaturedObjects();
    this.learningObjects = (await this.featureService.getNotFeaturedLearningObjects(this.query)).learningObjects;
  }

  dropFeatured() {
    this.featureService.addFeaturedObject();
  }
  removeFeatured() {
    this.featureService.removeFeaturedObject(this.learningObjects[1]);
  }
  saveFeatured() {
    this.featureService.saveFeaturedObjects();
  }

}



