import { MapPin } from "lucide-react";
import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map/map-marker";

interface LocationMarkerProps {
  location: LocationFeature;
  index: number; // add index so we can satisfy CoordinateWithIndex
  onHover: (data: LocationFeature) => void;
}

export function LocationMarker({ location, index, onHover }: LocationMarkerProps) {
  const coord = {
    id: location.properties.mapbox_id,
    latitude: location.geometry.coordinates[1],
    longitude: location.geometry.coordinates[0],
    name: location.properties.name,
    index,
  };

  return (
    <Marker
      longitude={coord.longitude}
      latitude={coord.latitude}
      data={coord}
      onHover={() => onHover(location)}
    >
      <div className="rounded-full flex items-center justify-center transform transition-all duration-200 bg-rose-500 text-white shadow-lg size-8 cursor-pointer hover:scale-110">
        <MapPin className="stroke-[2.5px] size-4.5" />
      </div>
    </Marker>
  );
}
