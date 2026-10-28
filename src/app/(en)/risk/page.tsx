import { DocumentPage } from '@/components/pages/DocumentPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('en', 'risk');

export default function RiskPage() {
  return <DocumentPage locale="en" kind="risk"/>;
}
