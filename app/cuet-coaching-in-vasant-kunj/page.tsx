import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("vasant-kunj");

export default function VasantKunjPage() {
  return <LocationPageView slug="vasant-kunj" />;
}
