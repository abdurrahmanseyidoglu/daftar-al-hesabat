"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <main
      className="prose"
      style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}
    >
      <h1>{t("title")}</h1>

      <section>
        <h3>{t("overviewHeading")}</h3>
        <p>{t("overviewBody")}</p>
      </section>

      <section>
        <h3>{t("collectHeading")}</h3>
        <ul>
          <li>{t("collectItem1")}</li>
          <li>{t("collectItem2")}</li>
          <li>{t("collectItem3")}</li>
        </ul>
      </section>

      <section>
        <h3>{t("useHeading")}</h3>
        <ul>
          <li>{t("useItem1")}</li>
          <li>{t("useItem2")}</li>
          <li>{t("useItem3")}</li>
        </ul>
      </section>

      <section>
        <h3>{t("storageHeading")}</h3>
        <p>{t("storageBody")}</p>
      </section>

      <section>
        <h3>{t("securityHeading")}</h3>
        <p>{t("securityBody")}</p>
      </section>

      <section>
        <h3>{t("childrenHeading")}</h3>
        <p>{t("childrenBody")}</p>
      </section>

      <section>
        <h3>{t("contactHeading")}</h3>
        <p>{t("contactBody")}</p>
      </section>
    </main>
  );
}
