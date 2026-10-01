import { AboutMe, FeaturedWorks, Hero, Progress, Steps } from "./components";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <Progress />
      <Steps />
      <FeaturedWorks />
    </main>
  );
}
