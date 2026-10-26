import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <Skeleton className="h-12 w-40" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}