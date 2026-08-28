import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b-[3px] border-primary bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-heading text-lg font-bold">
          <span className="text-ink-muted">data.</span>
          <span className="text-logo-green">Nature.</span>
          <span className="text-logo-orange">Hungry</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/datasets" className="text-primary hover:text-primary-hover">
            Datasets
          </Link>
        </nav>
      </div>
    </header>
  );
}
