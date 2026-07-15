import { SmoothScroll } from "@/components/SmoothScroll";
import { Story } from "@/components/Story";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative w-full">
        <Story />
      </main>
    </SmoothScroll>
  );
}
