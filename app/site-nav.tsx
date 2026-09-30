import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  key: "projects" | "python" | "contact";
};

// Every item is a real link: on-page sections use hash links, the tracker is its own route.
const items: NavItem[] = [
  { label: "Case Studies", href: "/#projects", key: "projects" },
  { label: "Python", href: "/python-projects", key: "python" },
  { label: "Contact", href: "/#contact", key: "contact" },
];

// onPage: the nav sits on the homepage (or a company copy like /unity), so section
// links become bare hashes and keep the visitor on the URL they arrived at.
export default function SiteNav({ current, onPage }: { current?: NavItem["key"]; onPage?: boolean }) {
  return (
    <nav aria-label="Main" className="mono flex gap-5 text-[15px]">
      {items.map((item) => (
        <Link
          key={item.key}
          href={onPage && item.href.startsWith("/#") ? item.href.slice(1) : item.href}
          aria-current={current === item.key ? "page" : undefined}
          className={`site-nav-link ${current === item.key ? "is-current" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
