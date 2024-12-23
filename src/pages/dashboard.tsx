import DTicket from "../components/board/DTicket";
import DColumn from "../components/board/DColumn";
import Navbar from "../components/navigation/navbar";
import Logo from "../components/tags/logo";
import { ReactElement } from "react";
export default function Dashboard() {
  const tickets1: ReactElement[] = [<DTicket id={1} task="Clean kitchen" />];
  const tickets2: ReactElement[] = [<DTicket id={2} task="Clean Room" />];

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-3 px-4 py-2 bg-white border-b-2">
        <Logo size={38} />
        <Navbar />
      </div>
      <div className="flex flex-col gap-4 p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold">Current week</h1>
        {/* Search bar and filter options*/}
        <div className="grid grid-cols-3 grid-rows-1 gap-2">
          <input
            className="col-span-2 rounded-md border-2 bg-page-bg px-3 py-2 focus-visible:outline-black"
            type="text"
            placeholder="Search tasks..."
          />
          <select className="bg-transparent border-2 rounded-md p-1 focus:outline-black">
            <option>All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        {/* board */}
        <DColumn columnId={1} title={"Pending"} tickets={tickets1} />

        <DColumn columnId={2} title={"In Progress"} tickets={tickets2} />
      </div>
    </>
  );
}
