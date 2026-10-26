import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <Skeleton className="h-12 w-1/3" />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}