import dynamic from "next/dynamic";

/**
 * DynamicMarkerCluster component is a dynamic import wrapper for the MarkerCluster component.
 * It allows for lazy loading of the MarkerCluster component, improving performance by only loading it when needed.
 *
 * @component
 * @example
 * // Usage:
 * import DynamicMarkerCluster from './MarkerCluster/DynamicMarkerCluster';
 *
 * function App() {
 *   return (
 *     <div>
 *       <DynamicMarkerCluster />
 *     </div>
 *   );
 * }
 *
 * @returns {React.Component} The DynamicMarkerCluster component.
 */

const DynamicMarkerCluster = dynamic(() => import("./MarkerCluster"), {
  ssr: false,
});

export default DynamicMarkerCluster;
