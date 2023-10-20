import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayout } from './layouts/main/main.layout';
import { RouterModule } from '@angular/router';
import { PanelComponent } from './components/panel/panel.component';
import { InputComponent } from './components/form-field/input/input.component';
import { SelectComponent } from './components/form-field/select/select.component';
import { TextareaComponent } from './components/form-field/textarea/textarea.component';
import { CheckComponent } from './components/form-field/check/check.component';
import { RadioComponent } from './components/form-field/radio/radio.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { TableComponent } from './components/table/table.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { DateComponent } from './components/form-field/date/date.component';
import { AutocompleteComponent } from './components/form-field/autocomplete/autocomplete.component';
import { CustomFieldComponent } from './components/form-field/custom-field/custom-field.component';

@NgModule({
  declarations: [
    MainLayout,
    PanelComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    CheckComponent,
    RadioComponent,
    ModalComponent,
    TableComponent,
    SnackbarComponent,
    DateComponent,
    AutocompleteComponent,
    CustomFieldComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    PanelComponent,
    InputComponent,
    DateComponent,
    SelectComponent,
    AutocompleteComponent,
    TextareaComponent,
    CheckComponent,
    RadioComponent,
    ModalComponent,
    TableComponent,
    SnackbarComponent,
    CustomFieldComponent
  ]
})
export class SharedModule { }
