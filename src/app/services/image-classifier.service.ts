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

      // Try multiple backends in order of preference
      const backends = ['webgl', 'wasm', 'cpu'];
      let backendSet = false;

      for (const backend of backends) {
        try {
          await tf.setBackend(backend);
          console.log(`TensorFlow.js backend set to ${backend}`);
          backendSet = true;
          break;
        } catch (error) {
          console.warn(`Failed to set ${backend} backend:`, error);
        }
      }

      if (!backendSet) {
        this.modelError.set(
          'Failed to initialize TensorFlow.js backend on your device.'
        );
        return;
      }
      this.model = await mobileNet.load();

      this.modelLoaded.set(true);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      this.modelError.set('Failed to load model');
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
