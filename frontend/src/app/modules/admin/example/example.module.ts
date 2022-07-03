import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { ConnectionComponent } from '../connection/connection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';


const exampleRoutes: Route[] = [
    {
        path: '',
        component: ExampleComponent
    },
    {
        path: 'connection',
        component: ConnectionComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent,
        ConnectionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(exampleRoutes),
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        MatDividerModule,
        MatRadioModule,
        MatCheckboxModule,
        MatIconModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatInputModule
    ]
})
export class ExampleModule {
}
