export function FeaturedProductsSkeleton() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-9 w-48 bg-linear-to-r from-muted to-muted/70 rounded skeleton mb-2" />
          <div className="h-5 w-64 bg-linear-to-r from-muted to-muted/70 rounded skeleton" />
        </div>
        <div className="h-10 w-24 bg-linear-to-r from-muted to-muted/70 rounded skeleton" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[400px] rounded-2xl bg-gradient-card border glass skeleton"
          />
        ))}
      </div>
    </section>
  );
}
