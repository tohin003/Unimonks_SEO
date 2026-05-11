import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("munirka");

export default function MunirkaPage() {
  return <LocationPageView slug="munirka" />;
}
