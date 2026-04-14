import { Routes, Route} from 'react-router';
import Layout from "./Layout";
import About from "./About";
import Catalogo from "./Catalogo";
import Detail from "./Detail";
import Collection from "./Collection";

const RouterDefinition = () => {
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Catalogo/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/pokemon/:id" element={<Detail />} />
            </Route>
        </Routes>
    );
}

export default RouterDefinition;