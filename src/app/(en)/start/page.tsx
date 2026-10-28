import { DocumentPage } from '@/components/pages/DocumentPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('en', 'start');

export default function StartPage() {
  return <DocumentPage locale="en" kind="start"/>;
}
