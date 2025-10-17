import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-1">
      <Button
        variant={i18n.language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === 'vi' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => i18n.changeLanguage('vi')}
      >
        VI
      </Button>
    </div>
  );
}
