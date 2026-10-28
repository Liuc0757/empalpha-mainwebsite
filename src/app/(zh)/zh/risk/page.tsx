import { DocumentPage } from '@/components/pages/DocumentPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('zh', 'risk');

export default function RiskPage() {
  return <DocumentPage locale="zh" kind="risk"/>;
}
