export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--app-header-height))] w-full max-w-4xl flex-col justify-center gap-4 px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-muted-foreground">
        Placeholder page
      </p>
      <h1 className="text-4xl font-semibold tracking-normal text-foreground">
        About A.S.C.A.
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        This destination is available for navigation validation. Full A.S.C.A.
        overview content will be added in a later feature.
      </p>
    </div>
  )
}
