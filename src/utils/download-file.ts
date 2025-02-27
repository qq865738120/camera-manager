export default async function downloadFile(myData: any) {
  const fileName = '拍摄流';
  const json = encodeURIComponent(JSON.stringify(myData));
  const blob = new Blob([json], { type: 'application/json' });
  const href = await URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
