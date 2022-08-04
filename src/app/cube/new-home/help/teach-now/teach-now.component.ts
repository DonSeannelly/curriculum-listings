import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LearningObject, Topic } from '@entity';
import { LearningObjectService } from 'app/cube/learning-object.service';
import { RelevancyService } from '../../../../core/relevancy.service';

@Component({
  selector: 'clark-teach-now',
  templateUrl: './teach-now.component.html',
  styleUrls: ['./teach-now.component.scss']
})
export class TeachNowComponent implements OnInit, AfterViewInit {

  // Topic variables
  topics: Topic[] = [];
  selectedTopic: string;

  // HTML elements
  @ViewChild('topicScroll') scroll: ElementRef;
  width: number = window.screen.width;

  // Object variables
  objects: LearningObject[] = [];
  loadingObjects = [new LearningObject(), new LearningObject(), new LearningObject(), new LearningObject()];
  loading: boolean = false;

  constructor(
    private relevancyService: RelevancyService,
    private objectService: LearningObjectService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.objects = this.loadingObjects;
    this.relevancyService.getTopics().then(topics => {
      this.topics = topics;

      if (topics.length > 0) {
        this.selectTopic(this.topics[0]._id)
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.scroll) {
      this.scroll.nativeElement.addEventListener('wheel', this.horizontalScroll.bind(this));
    }
  }

  /**
   * Handles auto scrolling horizontally over the topics they can search by
   *
   * @param event The scroll event
   */
  horizontalScroll(event) {
    this.scroll.nativeElement.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  /**
   * Listens for the window to be resized to change the css
   *
   * @param event The window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.width = event.target.innerWidth;
  }

  /**
   * Selects a topic from the list of topics and refreshes
   * the first four objects associated with that topic
   *
   * @param topicId The topic id selected
   */
  selectTopic(topicId: string) {
    this.selectedTopic = topicId;
    this.getObjects();
  }

  /**
   * Gets the objects associated with a specific topic
   */
  getObjects() {
    this.loading = true;
    this.objects = this.loadingObjects;
    this.objectService.getLearningObjects({
      limit: 4,
      currPage: 1,
      status: ['released'],
      topics: [this.selectedTopic],
    }).then(res => {
      this.objects = res.learningObjects;
      this.loading = false;
    });
  }

  /**
   * Navigates to the browse page with the selected topic
   */
  navigate() {
    this.router.navigate(['browse'], { queryParams: { topics: this.selectedTopic }});
  }

}
