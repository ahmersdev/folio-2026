import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="text-sm tracking-widest text-muted-foreground uppercase">
        Design system · foundation check
      </span>
      <h1 className="font-display text-5xl leading-tight tracking-normal normal-case sm:text-7xl">
        Every line of code, <span className="text-primary">foreseen.</span>
      </h1>
      <p className="max-w-md text-muted-foreground">
        Protest Revolution hero heading, Bebas Neue for everything else, Inter
        body, Sharingan red accent — toggle the theme to check both modes.
      </p>
      <Button>View Projects</Button>
    </main>
  );
}
