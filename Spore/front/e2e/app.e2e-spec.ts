import { SporePage } from './app.po';

describe('spore App', function() {
  let page: SporePage;

  beforeEach(() => {
    page = new SporePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
