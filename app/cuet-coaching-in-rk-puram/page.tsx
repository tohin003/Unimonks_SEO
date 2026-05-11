import { LocationPageView } from "@/components/location-page-view";
import { buildLocationMetadata } from "@/lib/locations";

export const metadata = buildLocationMetadata("rk-puram");

export default function RkPuramPage() {
  return <LocationPageView slug="rk-puram" />;
}
