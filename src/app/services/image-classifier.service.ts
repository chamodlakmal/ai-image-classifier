import { Injectable, signal } from '@angular/core';
import * as mobileNet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root',
})
export class ImageClassifierService {
  private model: mobileNet.MobileNet | null = null;

  public modelLoaded = signal(false);
  public isLoading = signal(false);
  public modelError = signal<string | null>(null);

  constructor() {
    this.loadModel();
  }

  async loadModel() {
    this.isLoading.set(true);
    this.modelError.set(null);
    try {
      await tf.ready();

      if (tf.getBackend() === null) {
        try {
          await tf.setBackend('webgl');
          console.log('TensorFlow.js backend set to WebGL');
        } catch (error) {
          console.error('Error setting TensorFlow.js backend:', error);
          this.modelError.set(
            'Failed to set TensorFlow.js backend. Please try again later.'
          );
          return;
        }
      } else {
        console.log('Using existing TensorFlow.js backend:', tf.getBackend());
      }

      this.model = await mobileNet.load();
      this.modelLoaded.set(true);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      this.modelError.set('Failed to load model. Please try again later.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async classifyImage(image: HTMLImageElement) {
    if (!this.model) {
      console.error('Model is not loaded yet');
      return [];
    }
    try {
      const predictions = await this.model.classify(image);
      return predictions;
    } catch (error) {
      console.error('Error classifying image:', error);
      return [];
    }
  }
}
