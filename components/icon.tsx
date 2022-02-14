import { Crosshairs } from "./icons/crosshairs";
import { Location } from "./icons/location";
import { MapMarker } from "./icons/map-marker";
import { Search } from "./icons/search";
import { SearchLocation } from "./icons/search-location";

export const icons = {
  crosshairs: Crosshairs,
  location: Location,
  "map-marker": MapMarker,
  search: Search,
  "search-location": SearchLocation,
};

export type IconType = keyof typeof icons;

export interface IconSVGProps {
  height?: number;
}

export interface IconProps extends IconSVGProps {
  name: IconType;
}

/**
 * The icons shows svg icons with a specific size which can be customized. The color of the icon is based on the current text color and can be overwritten by add a tailwind class on the parents element like `text-primary`.
 */
export const Icon = ({ name, ...props }: IconProps) =>
  icons[name]({ ...props });
