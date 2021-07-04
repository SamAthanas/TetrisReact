import Tetris from "./tetris";
import { GlitchRaw } from "../constants/filters";

function MyApp({ Component, pageProps }) {
    return (<>
        <Tetris/>
        {GlitchRaw()}
        </>
    );
}

export default MyApp;