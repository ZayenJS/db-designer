export class FileUtil {
  public static makeDownloadableFile(
    content: string,
    filename: string,
    contentType: string = 'text/plain',
  ) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  }
}
