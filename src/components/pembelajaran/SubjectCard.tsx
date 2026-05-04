import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  title: string;
  description: string;
  badgeText: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  badgeClassName?: string;
  href: string;
  role?: "guru" | "siswa";
  actionText?: string;
  disabled?: boolean;
}

export function SubjectCard({
  title,
  description,
  badgeText,
  badgeVariant = "secondary",
  badgeClassName,
  href,
  role = "guru",
  actionText = "Lihat Detail",
  disabled = false,
}: SubjectCardProps) {
  const isGuru = role === "guru";
  
  const cardGradient = isGuru 
    ? "from-white to-primary/5 dark:from-zinc-900 dark:to-primary/10" 
    : "from-white to-green-50/30 dark:from-zinc-900 dark:to-green-950/10";
    
  const topBarColor = isGuru 
    ? "bg-primary/40 group-hover:bg-primary" 
    : "bg-green-500/40 group-hover:bg-green-500";
    
  const hoverTextColor = isGuru 
    ? "group-hover:text-primary" 
    : "group-hover:text-green-600";
    
  const iconColor = isGuru 
    ? "text-muted-foreground group-hover:text-primary" 
    : "text-green-500/40 group-hover:text-green-500";
    
  const defaultBadgeClass = isGuru 
    ? "bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs"
    : "bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 text-xs"; 

  const actionTextColor = isGuru 
    ? "text-primary/40 group-hover:text-primary/80" 
    : "text-green-600/60 group-hover:text-green-600";
  
  const CardContentWrapper = (
    <Card className={cn(
      "h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br flex flex-col",
      cardGradient,
      !disabled && "group-hover:-translate-y-1"
    )}>
      <div className={cn("h-2 transition-colors", topBarColor)} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant={badgeVariant} className={cn(badgeClassName || defaultBadgeClass)}>
            {badgeText}
          </Badge>
          <BookOpen className={cn("w-4 h-4 transition-colors", iconColor)} />
        </div>
        <CardTitle className={cn("mt-4 text-xl transition-colors line-clamp-2", hoverTextColor)}>
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col justify-between flex-grow min-h-[80px]">
        <div className="flex items-center gap-2 mt-2">
           <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                </div>
              ))}
           </div>
           <span className="text-[10px] text-muted-foreground italic">Fitur materi segera hadir</span>
        </div>
        <div className={cn("flex items-center justify-end text-xs font-bold uppercase tracking-widest mt-auto pt-4 transition-colors", actionTextColor)}>
          {actionText} <ChevronRight className="ml-1 w-4 h-4" />
        </div>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return (
      <div className="group block h-full cursor-not-allowed opacity-90">
        {CardContentWrapper}
      </div>
    );
  }

  return (
    <Link href={href} className="group block h-full">
      {CardContentWrapper}
    </Link>
  );
}
