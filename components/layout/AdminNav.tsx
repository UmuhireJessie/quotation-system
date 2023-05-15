import Sidebar from "./sidebar";
import AvatarWithDropdown from "./Avatar";

function Adminbar() {

  return (
    <div className="flex items-center">
      <div className="items-end fixed z-50 ml-[16rem] top-0 border-b w-screen shadow-md bg-white">
        <div className="float-right mr-[20rem] mt-4 pb-4">
        <AvatarWithDropdown />
        </div>

      </div>
      <div className="block">
        <Sidebar />
      </div>
    </div>
  );
}

export default Adminbar;