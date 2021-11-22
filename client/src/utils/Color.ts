export class Color {
  public static getLuminance = (hexColor: string) => {
    const c = hexColor.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  };

  public static lighten = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16);

    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const B = ((num >> 8) & 0x00_ff) + amt;
    const G = (num & 0x00_00_ff) + amt;

    return (
      0x1_00_00_00 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x1_00_00 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1);
  };
}
