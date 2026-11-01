import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function LearnBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-foreground">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link href="/Learn" className="hover:text-foreground">Learn</Link></li>
        {items.map((item, index) => (
          <li key={item.item} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {index === items.length - 1 ? (
              <span aria-current="page" className="max-w-[16rem] truncate text-foreground">{item.name}</span>
            ) : (
              <Link href={item.item} className="hover:text-foreground">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
