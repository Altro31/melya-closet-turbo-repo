import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const APP_LOCALE = "en-US";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale: Intl.LocalesArgument = APP_LOCALE,
) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function sleep(seconds: number) {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, seconds * 1000);
  return promise;
}

