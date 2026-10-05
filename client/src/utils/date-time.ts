/**
 * ฟังก์ชันภายในสำหรับจัดการรูปแบบเวลา โดยใช้ Locale ภาษาไทย (th-TH)
 * param hourCycle "h23" เพื่อใช้รูปแบบ 24 ชั่วโมง
 */
function formatTime(value: string | Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(value));
}

// แปลงเวลาให้เป็นรูปแบบ HH:mm ในโซนเวลา UTC
export function formatUtcTime(value: string | Date): string {
  return formatTime(value, "UTC");
}

// แปลงเวลาให้เป็นรูปแบบ HH:mm ตามโซนเวลาของ Local Time
export function formatLocalTime(value: string | Date): string {
  return formatTime(value);
}

// แปลงวัน เวลาให้เป็นรูปแบบ "วว ด.ด. ปปปป HH:mm"
export function formatLocalDateTime(value: string | Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}
