import type { MissionCountdown } from '@/types/models/mission';

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();

    reader.onload = () => {
      resolve(<string>reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export function fillNumberZero(num: number): string {
  return `${num >= 0 && num < 10 ? '0' : ''}${num}`;
}

export function getCountdown(time: string): MissionCountdown {
  const endDate = new Date(time);

  const total = endDate.getTime() - Date.now();
  
  if (total > 0) {
    const s = fillNumberZero(Math.floor((total / 1000) % 60));
    const m = fillNumberZero(Math.floor((total / 1000 / 60) % 60));
    const h = fillNumberZero(Math.floor((total / (1000 * 60 * 60)) % 24));
    const d = Math.floor(total / (1000 * 60 * 60 * 24)).toString();

    return { d, h, m, s };
  }

  return { d: '0', h: '00', m: '00', s: '00' };
}
