import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About Nisha Gupta"
      description="Nisha Gupta is an independent nail artist based in [City]. Her work combines traditional techniques with modern designs, creating hand-painted press-on nails that are made to order."
    />
  );
}