import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageClassifierComponent } from './image-classifier/image-classifier.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageClassifierComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ai-image-classifier';
}
