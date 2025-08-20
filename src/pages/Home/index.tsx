import { Outlet } from "react-router-dom";

export default function HomeScreen() {
    return (<>
    <h1>Home Page</h1>
    <Outlet />
    </>)
}