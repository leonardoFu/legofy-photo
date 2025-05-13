import { LegoImageConverter } from "@/components/LegoImageConverter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "@/app/i18n";

// Define params type for dynamic route
interface PageParams {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Home({ params }: PageParams) {
  const { lang } = await params;
  const { t } = await getTranslations(lang, 'common');
  
  // Prepare translations for client components
  const translations = {
    title: t('title'),
    subtitle: t('subtitle'),
    uploadImage: t('uploadImage'),
    chooseDifferentImage: t('chooseDifferentImage'),
    legoPreviewWillAppear: t('legoPreviewWillAppear'),
    processing: t('processing'),
    download: t('download'),
    brickStats: t('brickStats'),
    totalBricks: t('totalBricks'),
    colorDistribution: t('colorDistribution'),
    brickSettings: t('brickSettings'),
    brickWidth: t('brickWidth'),
    brickHeight: t('brickHeight'),
    lowDetail: t('lowDetail'),
    mediumDetail: t('mediumDetail'),
    highDetail: t('highDetail'),
    transformToLego: t('transformToLego'),
    footerText: t('footerText'),
    errorSelectImage: t('error.selectImage')
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="mb-6 md:mb-12 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-blue-700">{translations.title}</h2>
          <p className="hidden md:block text-base md:text-xl text-gray-800 max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </div>

        {/* Main App Interface */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-[12px] border-blue-600">
          {/* Transform Interface (flattened, no tabs) */}
          <div className="p-4 md:p-6">
            <LegoImageConverter translations={translations} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer lang={lang} footerText={translations.footerText} />
    </div>
  );
}
