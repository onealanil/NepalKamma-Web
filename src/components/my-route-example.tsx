"use client";

import MapRoute from "./map/map-route";

export default function MyRouteExample() {
  const coordinates = [
    {
      id: "point-1",
      latitude: 26.6679,
      longitude: 87.3649,
      name: "Start Point",
    },
    {
      id: "point-2", 
      latitude: 26.4525,
      longitude: 87.2718,
      name: "End Point",
    },
  ];

  return (
    <MapRoute 
      coordinates={coordinates}
      showRoute={true}
      routeColor="#ef4444"
      routeWidth={4}
    />
  );
}
