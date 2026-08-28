"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Roughly the extent of Singapore and its immediate waters.
const SINGAPORE_BOUNDS: L.LatLngBoundsExpression = [
  [1.13, 103.55],
  [1.495, 104.13],
];
const SINGAPORE_CENTER: L.LatLngExpression = [1.3521, 103.8198];

function FitToData({ data }: { data: GeoJSON.FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (!data.features.length) return;
    const layer = L.geoJSON(data);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [data, map]);
  return null;
}

export function DatasetMap({ data }: { data: GeoJSON.FeatureCollection }) {
  const geoJsonKey = useRef(0);
  geoJsonKey.current += 1;

  return (
    <div className="isolate relative z-0 mb-4 h-80 overflow-hidden rounded-lg border border-line">
      <MapContainer
        center={SINGAPORE_CENTER}
        zoom={11}
        minZoom={11}
        maxBounds={SINGAPORE_BOUNDS}
        maxBoundsViscosity={0.2}
        preferCanvas
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_26hm_1_304b9580a7cc66ecb19c3954"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <GeoJSON
          key={geoJsonKey.current}
          data={data}
          pointToLayer={(_feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 5,
              weight: 1,
              color: "#1d4d3f",
              fillColor: "#3fa06b",
              fillOpacity: 0.8,
            })
          }
          style={{ color: "#1d4d3f", weight: 2, fillColor: "#3fa06b", fillOpacity: 0.3 }}
        />
        <FitToData data={data} />
      </MapContainer>
    </div>
  );
}
