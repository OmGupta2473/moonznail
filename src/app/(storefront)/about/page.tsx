import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About"
      description="Artist biography and process content will be implemented in a later task."
    />
  );
}