export class Space {
  public static getPositionAtCenter(element: HTMLElement) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  }

  public static getDistanceBetweenElements(a: HTMLElement, b: HTMLElement) {
    const aPosition = Space.getPositionAtCenter(a);
    const bPosition = Space.getPositionAtCenter(b);

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
  }
}
