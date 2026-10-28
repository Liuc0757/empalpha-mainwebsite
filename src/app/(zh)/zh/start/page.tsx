import { DocumentPage } from '@/components/pages/DocumentPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('zh', 'start');

export default function StartPage() {
  return <DocumentPage locale="zh" kind="start"/>;
}
