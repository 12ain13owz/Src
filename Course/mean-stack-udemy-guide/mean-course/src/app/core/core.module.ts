import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
<<<<<<< HEAD
<<<<<<< HEAD
=======
  providers: [ErrorInterceptorProviders],
>>>>>>> parent of 28fb870 (Update course mean stack)
=======
  providers: [ErrorInterceptorProviders],
>>>>>>> parent of 28fb870 (Update course mean stack)
})
export class CoreModule {}
