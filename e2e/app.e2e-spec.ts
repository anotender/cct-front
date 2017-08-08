import { CctFrontPage } from './app.po';

describe('cct-front App', () => {
  let page: CctFrontPage;

  beforeEach(() => {
    page = new CctFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
