// src/components/LanguageSwitcher.js


import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = async (lng: string) => {
    await router.push(router.pathname, router.asPath, { locale: lng });
    await i18n.changeLanguage(lng); // Sync client i18n
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => changeLanguage("en")}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("af")}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        Afrikaans
      </button>
      <button
        onClick={() => changeLanguage("xh")}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        Xhosa
      </button>
    </div>
  );
};

export default LanguageSwitcher;
