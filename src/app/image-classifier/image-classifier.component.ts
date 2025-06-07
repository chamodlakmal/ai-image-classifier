import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ImageClassifierService } from '../services/image-classifier.service';

@Component({
  selector: 'app-image-classifier',
  imports: [],
  templateUrl: './image-classifier.component.html',
  styleUrl: './image-classifier.component.css',
})
export class ImageClassifierComponent {
  private imageClassifierService = inject(ImageClassifierService);

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  errorMessage = signal<string | null>(null);
  predictions = signal<prediction[]>([]);
  isLoading = this.imageClassifierService.isLoading;
  modelLoaded = this.imageClassifierService.modelLoaded;
  imageSource = signal<string | ArrayBuffer | null>(null);
  isImageClassifing = signal(false);
  modelError = this.imageClassifierService.modelError;

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      this.errorMessage.set('Please select a file.');
      return;
    }
    const file = fileInput.files[0];
    if (!file.type.match('image.*')) {
      this.errorMessage.set('Please select a valid image file.');
      return;
    }

    this.errorMessage.set(null); // Clear any previous error message
    this.predictions.set([]); // Clear previous predictions

    const reader = new FileReader();
    reader.onload = () => {
      this.imageSource.set(reader.result);
      setTimeout(() => {
        this.classifyLoadedImage();
      }, 100);
    };
    reader.readAsDataURL(file);
  }

  async classifyLoadedImage() {
    if (!this.imageElement || !this.imageElement.nativeElement) {
      this.errorMessage.set('Image element is not available.');
      return;
    }
    this.isImageClassifing.set(true);
    try {
      const pred = await this.imageClassifierService.classifyImage(
        this.imageElement.nativeElement
      );
      console.log('Predictions:', pred);
      this.predictions.set(pred);
    } catch (error) {
      console.error('Error classifying image:', error);
      this.errorMessage.set('Error classifying image. Please try again.');
    } finally {
      this.isImageClassifing.set(false);
    }
  }

  getProbabiltyPercentage(probability: number): string {
    return (probability * 100).toFixed(2) + '%';
  }
}

interface prediction {
  className: string;
  probability: number;
}
