import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
});

/**
 * Renders a map component.
 *
 * @file /src/components/Map/index.js
 * @description The Map component is responsible for rendering a map using the DynamicMap component.
 *
 * @param {object} props - The props object containing the necessary data for rendering the map.
 * @returns {JSX.Element} The rendered map component.
 */

const Map = (props) => {
  return (
    <div
      className="col"
      style={{
        padding: 0,
      }}
    >
      <DynamicMap {...props} />
    </div>
  );
};

export default Map;
