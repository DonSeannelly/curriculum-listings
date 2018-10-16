import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningObjectBuilderComponent } from './learning-object-builder.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { OutcomeTypeaheadComponent } from './components/outcome/outcome-typeahead/outcome-typeahead.component';
import { BuilderNavbarComponent } from './components/builder-navbar/builder-navbar.component';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { OutcomePageComponent } from './pages/outcome-page/outcome-page.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { SharedModule } from 'app/shared/shared.module';
import { MetadataComponent } from './pages/info-page/metadata/metadata.component';
import { BuilderStore } from './builder-store.service';
import { BuilderRoutingModule } from './learning-object-builder.routing';
import { ColumnWrapperComponent } from './components/column-wrapper/column-wrapper.component';
import { FormsModule } from '@angular/forms';
import { ContentUploadModule } from './components/content-upload/app/content-upload.module';
import { StandardOutcomesComponent } from './components/standard-outcomes/standard-outcomes.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BuilderRoutingModule,
    FormsModule,
    ContentUploadModule
  ],
  declarations: [
    LearningObjectBuilderComponent,
    BuilderNavbarComponent,
    // outcome components
    OutcomeComponent,
    OutcomeTypeaheadComponent,
    // metadata components
    MetadataComponent,
    // pages
    InfoPageComponent,
    OutcomePageComponent,
    MaterialsPageComponent,
    ColumnWrapperComponent,
    StandardOutcomesComponent,
  ],
  providers: [BuilderStore]
})
export class LearningObjectBuilderModule { }
