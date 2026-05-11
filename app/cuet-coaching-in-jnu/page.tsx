import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("jnu");

export default function JnuPage() {
  return <LocationPageView slug="jnu" />;
}
