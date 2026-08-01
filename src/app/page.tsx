import type { ComponentType } from "react";

import { Amenities } from "@/components/Amenities";
import { ApartmentDesign } from "@/components/ApartmentDesign";
import { EntryPopup } from "@/components/EntryPopup";
import { FloatingActions } from "@/components/FloatingActions";
import { FloorPlan } from "@/components/FloorPlan";
import { Footer } from "@/components/Footer";
import { GoldValues } from "@/components/GoldValues";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { Pricing } from "@/components/Pricing";
import { ProjectInfo } from "@/components/ProjectInfo";
import { Reveal, type RevealDirection } from "@/components/Reveal";
import { siteConfig, type SectionKey } from "@/config/site";

// Registry the dynamic layout resolves siteConfig.layoutOrder against.
// Rearranging a page (or dropping a section entirely) is then just an edit
// to that array in src/config/site.ts — this registry and this file never
// need to change for a reorder.
const sectionComponents: Record<SectionKey, ComponentType> = {
  Hero,
  ProjectInfo,
  Location,
  Amenities,
  GoldValues,
  ApartmentDesign,
  FloorPlan,
  Pricing,
};

// Varies each section's entrance direction so the scroll-down reveal doesn't
// feel like the same animation repeating; Hero is exempt (renders instantly).
const sectionRevealDirection: Partial<Record<SectionKey, RevealDirection>> = {
  ProjectInfo: "up",
  Location: "left",
  Amenities: "right",
  GoldValues: "scale",
  ApartmentDesign: "left",
  FloorPlan: "right",
  Pricing: "up",
};

export default function HomePage() {
  return (
    <>
      <EntryPopup />
      <Header />
      <main>
        {siteConfig.layoutOrder.map((sectionKey) => {
          const Section = sectionComponents[sectionKey];
          // Hero renders immediately (no fade-in) so it doesn't delay LCP;
          // every section below it fades in as the user scrolls to it.
          if (sectionKey === "Hero") {
            return <Section key={sectionKey} />;
          }
          return (
            <Reveal key={sectionKey} direction={sectionRevealDirection[sectionKey]}>
              <Section />
            </Reveal>
          );
        })}
      </main>
      <Reveal direction="scale">
        <Footer />
      </Reveal>
      <FloatingActions />
    </>
  );
}
