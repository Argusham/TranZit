import { useEffect } from "react";
import LandingPage from "./landingpage";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["default"])),
    },
  };
};

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}
