
import { Viewer, Entity, Moon } from "resium";
import { Cartesian3 } from "cesium";
import { Ion } from "cesium";

const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NzQ1NzFhMy1mODk5LTQzNTAtYmU0ZS03Y2JiZTdiNzM4MWMiLCJpZCI6MjU4ODI2LCJpYXQiOjE3MzI4NTIxNTJ9.__UyCvpP95k5wJpRsplqk1RkeTOdhL1C9ktx_pYf0U8";

function App() {
  return (
    <Viewer  animation={false} timeline={false} full>
      <Entity position={position} point={pointGraphics} />
      <Moon/>
    </Viewer>
  );
}

export default App;