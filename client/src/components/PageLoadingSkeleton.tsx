import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export const GeneratorSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="max-w-6xl mx-auto">
      <Skeleton className="h-12 w-64 mb-8" />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ScannerSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-12 w-64 mb-8 mx-auto" />
      <Skeleton className="h-96 w-full rounded-xl mb-8" />
      <div className="flex gap-4 justify-center">
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="max-w-6xl mx-auto space-y-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen">
    <HeroSkeleton />
    <SectionSkeleton />
  </div>
);
