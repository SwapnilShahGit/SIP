/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { StaticBarComponent } from './static-bar.component';

describe('Component: StaticBar', () => {
  it('should create an instance', () => {
    let component = new StaticBarComponent();
    expect(component).toBeTruthy();
  });
});
