import "./App.css";
import { chartVega } from "./diagram.ts";
import embed from "vega-embed";

const sets = [
  { sets: ["A"], size: 12 },
  { sets: ["B"], size: 12 },
  { sets: ["C"], size: 12 },
  { sets: ["D"], size: 12 },
  { sets: ["A", "B"], size: 4 },
  { sets: ["A", "C"], size: 4 },
  { sets: ["B", "C"], size: 4 },
  { sets: ["A", "B", "C"], size: 2 },
  { sets: ["C", "D"], size: 4 }
];

function App() {
  function renderChart(ref: HTMLDivElement | null, sets: any | null) {
    // If the ref is null, return because the element is not rendered yet
    if (!ref || !sets) return;

    // Create the chart using vegalite
    const chart = chartVega(sets, {
      width: 600,
      height: 350,
      padding: 16,
      orientation: -Math.PI / 2,
      normalize: true,
    });

    // Embed the chart in the ref element
    console.log("chart schema: ", chart.schema);
    embed(ref, chart.schema).then((res) => console.log(res));
  }

  // Render the chart
  return <div ref={(node: HTMLDivElement | null) => renderChart(node, sets)} />
}

export default App;
