import { TestBed } from '@angular/core/testing';

import { ImageClassifierService } from './image-classifier.service';

describe('ImageClassifierService', () => {
  let service: ImageClassifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageClassifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
