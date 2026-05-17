"use client";

import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <main
      className="prose"
      style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}
    >
      <h1>{t("title")}</h1>

      <section>
        <h3>{t("acceptanceHeading")}</h3>
        <p>{t("acceptanceBody")}</p>
      </section>

      <section>
        <h3>{t("serviceHeading")}</h3>
        <p>{t("serviceBody")}</p>
      </section>

      <section>
        <h3>{t("responsibilitiesHeading")}</h3>
        <ul>
          <li>{t("responsibilityItem1")}</li>
          <li>{t("responsibilityItem2")}</li>
        </ul>
      </section>

      <section>
        <h3>{t("ipHeading")}</h3>
        <p>{t("ipBody")}</p>
      </section>

      <section>
        <h3>{t("liabilityHeading")}</h3>
        <p>{t("liabilityBody")}</p>
      </section>

      <section>
        <h3>{t("terminationHeading")}</h3>
        <p>{t("terminationBody")}</p>
      </section>

      <section>
        <h3>{t("governingLawHeading")}</h3>
        <p>{t("governingLawBody")}</p>
      </section>

      <section>
        <h3>{t("contactHeading")}</h3>
        <p>{t("contactBody")}</p>
      </section>
    </main>
  );
}
