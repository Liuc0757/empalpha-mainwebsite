import '../globals.css';
import type { ReactNode } from 'react';
export default function ChineseLayout({ children }: { children: ReactNode }) { return <html lang="zh-CN"><body>{children}</body></html>; }
