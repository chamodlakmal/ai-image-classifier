import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageClassifierComponent } from './image-classifier.component';

describe('ImageClassifierComponent', () => {
  let component: ImageClassifierComponent;
  let fixture: ComponentFixture<ImageClassifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageClassifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageClassifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
