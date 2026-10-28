import type { Locale } from '@/config/site';
import '../sections/sections.css';
import { Shell } from '../site/Shell';
import { Hero } from '../sections/Hero';
import { SignalProduct } from '../sections/SignalProduct';
import { ApexSection } from '../sections/ApexSection';
import { DeliverySection } from '../sections/DeliverySection';
import { AccessSection } from '../sections/AccessSection';
import { FAQSection } from '../sections/FAQSection';
export function HomePage({locale}:{locale:Locale}){return <Shell locale={locale}><Hero locale={locale}/><SignalProduct locale={locale}/><ApexSection locale={locale}/><DeliverySection locale={locale}/><AccessSection locale={locale}/><FAQSection locale={locale}/></Shell>}
