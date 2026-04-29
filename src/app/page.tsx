import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatINR, formatPackSize, buildWhatsAppLink, isAvailableNow } from "@/lib/utils";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import type { Product, ProductVariant } from "@/types/database";

const FH_SPICES_PHONE = "918978666059";

type ProductWithVariants = Product & { variants: ProductVariant[] };

const CATEGORY_META: Record<string, { label: string; tagline: string }> = {
  veg_pickle: {
    label: "Veg Pickles",
    tagline: "Aavakaya, gongura, and the rest of the family",
  },
  non_veg_pickle: {
    label: "Non-Veg Pickles",
    tagline: "Chicken, mutton, prawns — slow-cooked, travel-ready",
  },
  protein_snack: {
    label: "Protein Snacks",
    tagline: "Laddus and chikki — jaggery, no refined sugar",
  },
  spice_powder: {
    label: "Spice Powders",
    tagline: "Stone-ground, single-origin, your kitchen's backbone",
  },
};

const CATEGORY_ORDER = ["veg_pickle", "non_veg_pickle", "protein_snack", "spice_powder"];

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("is_active", true)
    .returns<ProductWithVariants[]>();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-[var(--color-terracotta)]">Could not load products: {error.message}</p>
      </div>
    );
  }

  const allProducts = products ?? [];

  // Categories with counts
  const categories = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    ...CATEGORY_META[cat],
    count: allProducts.filter((p) => p.category === cat).length,
  })).filter((c) => c.count > 0);

  // Featured: pick 3 — one veg pickle, one non-veg pickle, one protein snack if possible
  const featured = [
    allProducts.find((p) => p.category === "veg_pickle"),
    allProducts.find((p) => p.category === "non_veg_pickle"),
    allProducts.find((p) => p.category === "protein_snack"),
  ].filter((p): p is ProductWithVariants => Boolean(p));

  const orderWhatsApp = buildWhatsAppLink(
    FH_SPICES_PHONE,
    "Hi FH Spices, I'd like to place an order."
  );

  return (
    <>
      <SiteHeader />

      <main>
        {/* ============================================================
             HERO
             ============================================================ */}
        <section className="px-6 pt-20 md:pt-32 pb-20 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-terracotta)] mb-8">
              Hyderabad · est. with love
            </p>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-[var(--color-ink)]">
              No preservatives.
              <br />
              <em className="not-italic text-[var(--color-terracotta)]">Only memories.</em>
            </h1>

            <p className="mt-10 text-base md:text-lg text-[var(--color-ink-soft)] max-w-2xl mx-auto leading-relaxed">
              Homemade Hyderabadi pickles, spices, and protein snacks — nostalgia
              with no preservatives, only memories.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={orderWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[var(--color-terracotta)] text-[var(--color-paper)] font-medium hover:bg-[var(--color-terracotta-dark)] transition-colors text-sm tracking-wide"
              >
                Order on WhatsApp
              </a>
              <Link
                href="#menu"
                className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-terracotta)] transition-colors underline underline-offset-4 decoration-[var(--color-ink-faded)]"
              >
                Browse the menu
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
             CATEGORIES STRIP
             ============================================================ */}
        <section id="menu" className="px-6 py-16 md:py-20 border-t border-[var(--color-cream-dark)]">
          <div className="max-w-6xl mx-auto">
            <div className="rule-ornament max-w-md mx-auto mb-3">
              <span className="text-xs uppercase tracking-[0.3em]">The menu</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-center text-[var(--color-ink)] mb-16">
              Made in small batches
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className="bg-[var(--color-paper)] border border-[var(--color-cream-dark)] rounded-sm p-6 hover:border-[var(--color-terracotta)] transition-colors"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-faded)] mb-2">
                    {cat.count} {cat.count === 1 ? "item" : "items"}
                  </p>
                  <h3 className="font-display text-xl text-[var(--color-ink)] mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
             FEATURED PRODUCTS
             ============================================================ */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-terracotta)] mb-3">
                  This season
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[var(--color-ink)]">
                  From the kitchen
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((product) => {
                const minPrice = Math.min(...product.variants.map((v) => v.price_inr));
                const inSeason = isAvailableNow(product.available_months);

                return (
                  <article
                    key={product.id}
                    className="border border-[var(--color-cream-dark)] bg-[var(--color-paper)] p-8 flex flex-col"
                  >
                    {product.is_seasonal && (
                      <p className="text-xs uppercase tracking-[0.2em] mb-3"
                         style={{ color: inSeason ? "var(--color-leaf)" : "var(--color-ink-faded)" }}>
                        {inSeason ? "In season" : "Out of season"}
                      </p>
                    )}
                    <h3 className="font-display text-2xl text-[var(--color-ink)] mb-4">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-6 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-cream-dark)]">
                      <span className="text-sm text-[var(--color-ink-faded)]">
                        From {formatINR(minPrice)}
                      </span>
                      <a
                        href={buildWhatsAppLink(
                          FH_SPICES_PHONE,
                          `Hi FH Spices, I'd like to order ${product.name}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] underline underline-offset-4"
                      >
                        Order →
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
             FULL MENU LIST
             ============================================================ */}
        <section className="px-6 py-16 md:py-20 bg-[var(--color-cream-dark)]/40">
          <div className="max-w-4xl mx-auto">
            <div className="rule-ornament max-w-xs mx-auto mb-3">
              <span className="text-xs uppercase tracking-[0.3em]">Everything we make</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-center text-[var(--color-ink)] mb-12">
              The full menu
            </h2>

            <div className="space-y-2">
              {allProducts.map((product) => {
                const minPrice = Math.min(...product.variants.map((v) => v.price_inr));
                const maxPrice = Math.max(...product.variants.map((v) => v.price_inr));
                const priceLabel =
                  minPrice === maxPrice
                    ? formatINR(minPrice)
                    : `${formatINR(minPrice)} – ${formatINR(maxPrice)}`;

                return (
                  <a
                    key={product.id}
                    href={buildWhatsAppLink(
                      FH_SPICES_PHONE,
                      `Hi FH Spices, I'd like to order ${product.name}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline justify-between gap-4 py-4 border-b border-[var(--color-cream-dark)] hover:text-[var(--color-terracotta)] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-display text-lg text-[var(--color-ink)] group-hover:text-[var(--color-terracotta)] transition-colors">
                        {product.name}
                      </span>
                      <span className="text-xs ml-3 text-[var(--color-ink-faded)] uppercase tracking-wider">
                        {product.variants.length} sizes
                      </span>
                    </div>
                    <div className="flex-shrink-0 text-sm tabular-nums text-[var(--color-ink-soft)] group-hover:text-[var(--color-terracotta)] transition-colors">
                      {priceLabel}
                    </div>
                  </a>
                );
              })}
            </div>

            <p className="text-center text-sm text-[var(--color-ink-faded)] mt-12 italic">
              Tap any item to order on WhatsApp
            </p>
          </div>
        </section>

        {/* ============================================================
             STORY SNIPPET
             ============================================================ */}
        <section className="px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto">
            <div className="rule-ornament max-w-xs mb-3">
              <span className="text-xs uppercase tracking-[0.3em]">Our story</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--color-ink)] leading-tight mb-8">
              The way our grandmothers made them.
            </h2>
            <div className="space-y-5 text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed">
              <p>
                Every jar starts the same way it has for generations — raw mango
                from the season's first cut, mustard oil pressed cold, salt that's
                still rock and not powder. We do not use preservatives. We do not
                cut corners. We do not pretend to.
              </p>
              <p>
                What changes is who eats it. So we make laddus with flax seed and
                jaggery for the morning workout. We pack chikki without refined
                sugar. The recipes belong to our grandmothers; the way we eat
                belongs to now.
              </p>
            </div>
            <Link
              href="/story"
              className="inline-block mt-8 text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] underline underline-offset-4"
            >
              Read the full story →
            </Link>
          </div>
        </section>

        {/* ============================================================
             TRUST STRIP
             ============================================================ */}
        <section className="px-6 py-16 border-t border-[var(--color-cream-dark)]">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
            {[
              { label: "Homemade", body: "Cooked in our family kitchen, not a factory." },
              { label: "No preservatives", body: "Salt, oil, time. That is the only stack." },
              { label: "Made to order", body: "Small batches. Tell us what you want, we cook." },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display text-2xl text-[var(--color-terracotta)] mb-3">
                  {item.label}
                </p>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-xs mx-auto">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
             FINAL CTA
             ============================================================ */}
        <section className="px-6 py-20 md:py-28 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-[var(--color-ink)] mb-6 leading-tight max-w-2xl mx-auto">
            Some recipes stay in the family.
            <br />
            <em className="not-italic text-[var(--color-terracotta)]">These ones, we share.</em>
          </h2>
          <a
            href={orderWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-4 rounded-full bg-[var(--color-terracotta)] text-[var(--color-paper)] font-medium hover:bg-[var(--color-terracotta-dark)] transition-colors text-sm tracking-wide"
          >
            Order on WhatsApp
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
