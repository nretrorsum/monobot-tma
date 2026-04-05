export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-white">
        Mono<span className="text-purple">bot</span>
      </h1>
      <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
