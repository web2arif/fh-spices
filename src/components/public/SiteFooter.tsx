import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";

const FH_SPICES_PHONE = "918978666059";

export function SiteFooter() {
  const whatsappLink = buildWhatsAppLink(FH_SPICES_PHONE, "Hi FH Spices");

  return (
    <footer className="mt-24 border-t border-[var(--color-cream-dark)]">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <p className="wordmark text-base text-[var(--color-ink)]">FH SPICES</p>
          <p className="mt-3 text-sm text-[var(--color-ink-faded)] italic">
            Taste the original.
          </p>
        </div>

        <div className="text-sm text-[var(--color-ink-soft)] space-y-2">
          <p className="text-[var(--color-ink-faded)] uppercase tracking-widest text-xs mb-3">
            Order
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-[var(--color-terracotta)] transition-colors"
          >
            WhatsApp · +91 89786 66059
          </a>
          <a
            href="https://instagram.com/fhspices"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-[var(--color-terracotta)] transition-colors"
          >
            Instagram · @fhspices
          </a>
        </div>

        <div className="text-sm text-[var(--color-ink-soft)] space-y-2">
          <p className="text-[var(--color-ink-faded)] uppercase tracking-widest text-xs mb-3">
            Explore
          </p>
          <Link href="/story" className="block hover:text-[var(--color-terracotta)] transition-colors">
            Our story
          </Link>
          <Link href="/contact" className="block hover:text-[var(--color-terracotta)] transition-colors">
            Contact
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--color-cream-dark)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-faded)]">
          <p>© {new Date().getFullYear()} FH Spices. All recipes belong to the family.</p>
          <p>Hyderabad, India</p>
        </div>
      </div>
    </footer>
  );
}
