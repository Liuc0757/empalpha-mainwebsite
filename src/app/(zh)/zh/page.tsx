import { HomePage } from '@/components/pages/HomePage';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh','home');
export default function HomeZh() { return <HomePage locale="zh"/>; }
