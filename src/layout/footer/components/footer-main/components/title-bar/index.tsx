import { SocialLinks, Subtitle } from "@/components";

export default function TitleBar() {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
      <Subtitle className="text-center md:text-left" />
      <div className="flex items-center gap-3">
        <SocialLinks />
      </div>
    </div>
  );
}
