import Menu from "./menu";
import SearchBarWithDropdown from "./search-bar-dropdown";

export default function BaseMenu() {
    return (
        <div className="">
            <Menu/>
            <SearchBarWithDropdown />
        </div>
    );
}