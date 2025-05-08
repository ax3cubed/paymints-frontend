import type * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string
    href?: string
  }[]
  separator?: React.ReactNode
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)} {...props}>
      <ol className="flex items-center gap-1.5">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          return (
            <li key={segment.name} className="flex items-center gap-1.5">
              {segment.href && !isLast ? (
                <Link href={segment.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {segment.name}
                </Link>
              ) : (
                <span className={isLast ? "font-medium" : "text-muted-foreground"}>{segment.name}</span>
              )}
              {!isLast && separator}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export const BreadcrumbList = ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
  return (
    <ol className="flex items-center gap-1.5" {...props}>
      {children}
    </ol>
  )
}

export const BreadcrumbItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className="flex items-center gap-1.5" {...props}>
      {children}
    </li>
  )
}

export const BreadcrumbLink = ({
  children,
  href,
  ...props
}: { href: string } & React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors" {...props}>
      {children}
    </Link>
  )
}

export const BreadcrumbPage = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className="font-medium" {...props}>
      {children}
    </span>
  )
}

export const BreadcrumbSeparator = ({
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
  ...props
}: { separator?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) => {
  return <>{separator}</>
}

export const BreadcrumbEllipsis = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props}>{children}</span>
}
