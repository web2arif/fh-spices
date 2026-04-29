import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/utils";

const FH_SPICES_PHONE = "918978666059";

export function SiteHeader() {
  const whatsappLink = buildWhatsAppLink(
    FH_SPICES_PHONE,
    "Hi FH Spices, I'd like to place an order."
  );

  return (
    <header className="border-b border-[var(--color-cream-dark)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="wordmark text-lg md:text-xl text-[var(--color-ink)]">
          FH SPICES
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-terracotta)] transition-colors">
            Home
          </Link>
          <Link href="#menu" className="hover:text-[var(--color-terracotta)] transition-colors">
            Menu
          </Link>
          <Link href="/story" className="hover:text-[var(--color-terracotta)] transition-colors">
            Story
          </Link>
          <Link href="/contact" className="hover:text-[var(--color-terracotta)] transition-colors">
            Contact
          </Link>
        </nav>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-terracotta)] text-[var(--color-paper)] hover:bg-[var(--color-terracotta-dark)] transition-colors"
        >
          Order
        </a>
      </div>
    </header>
  );
}
