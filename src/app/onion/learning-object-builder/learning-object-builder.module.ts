import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningObjectBuilderComponent } from './learning-object-builder.component';
import { OutcomeComponent } from './components/outcome/outcome.component';
import { OutcomeTypeaheadComponent } from './components/outcome/outcome-typeahead/outcome-typeahead.component';
import { BuilderNavbarComponent } from './components/builder-navbar/builder-navbar.component';
import { InfoPageComponent } from './pages/info-page/info-page.component';
import { OutcomePageComponent } from './pages/outcome-page/outcome-page.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MetadataComponent } from './pages/info-page/metadata/metadata.component';
import { BuilderStore } from './builder-store.service';
//import { TextEditorComponent } from './components/text-editor.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    LearningObjectBuilderComponent,
    BuilderNavbarComponent,
    // outcome components
    OutcomeComponent,
    OutcomeTypeaheadComponent,
    // pages
    InfoPageComponent,
    OutcomePageComponent,
    MaterialsPageComponent,
    //Metadata for the Basic Info Page
    MetadataComponent,
  //texteditor
  //TextEditorComponent
  ],
  providers: [BuilderStore]
})
export class LearningObjectBuilderModule { }
