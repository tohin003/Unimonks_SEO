import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("saket");

export default function SaketPage() {
  return <LocationPageView slug="saket" />;
}
