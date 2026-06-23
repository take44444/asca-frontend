export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-var(--app-header-height))] w-full max-w-5xl flex-col justify-center gap-6 px-4 py-16 sm:px-6">
      <section className="grid gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          A Slightly Clever Agent
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
          A.S.C.A.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          A.S.C.A. - A Slightly Clever Agent - is an autonomous research
          assistant designed to assist users in various tasks.
        </p>
      </section>
    </div>
  )
}
