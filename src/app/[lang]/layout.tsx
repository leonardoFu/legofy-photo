import "./globals.css";
import { languages } from '@/app/i18n/settings';

type Params = Promise<{
  lang: string;
}>;

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode,
  params: Params
}) {

  return children;
}
