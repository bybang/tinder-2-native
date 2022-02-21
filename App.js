import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import Application from "./src/Application";

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <Application />
    </TailwindProvider>
  );
}
