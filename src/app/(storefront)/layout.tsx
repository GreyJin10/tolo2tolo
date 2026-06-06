import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BackToTop } from "@/components/shared/back-to-top";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* No pt-16 here — Hero is full-bleed, header is fixed/transparent */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <BackToTop />
    </>
  );
}
