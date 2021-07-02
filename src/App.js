import Tetris from "./pages/tetris";

import { GlitchRaw } from "./constants/filters";

function App() {
    return (<>
        <Tetris/>
        {GlitchRaw()}
        </>
    );
}

export default App;