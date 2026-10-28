import { siteConfig, type Locale } from '@/config/site';
/** Display context only; historical strings are never parsed or converted. */
export function timezoneLabel(locale: Locale): string {
  return siteConfig.sourceTimezone
    ? `${locale==='zh'?'原记录时区':'Source timezone'}: ${siteConfig.sourceTimezone}`
    : (locale==='zh'?'时区未确认':'Timezone unconfirmed');
}
