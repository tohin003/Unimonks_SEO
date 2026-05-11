import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("hauz-khas");

export default function HauzKhasPage() {
  return <LocationPageView slug="hauz-khas" />;
}
