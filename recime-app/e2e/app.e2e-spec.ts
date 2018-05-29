import { RecimeAppPage } from './app.po';

describe('recime-app App', () => {
  let page: RecimeAppPage;

  beforeEach(() => {
    page = new RecimeAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
