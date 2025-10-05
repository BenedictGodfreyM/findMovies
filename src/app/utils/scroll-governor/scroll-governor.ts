export class ScrollGovernor {

  /**
   * Handles smooth scrolling to the top of the page.
   */
  static scrollToTop(): void{
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  /**
   * Handles smooth scrolling to a specific section of the page.
   * 
   * @param id - Id of an element at the specific section of the page
   */
  static scrollToView(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
