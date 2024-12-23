import TaskTicket from "../components/board/taskTicket";
import TaskColumn from "../components/board/taskColumn";
import Navbar from "../components/navigation/navbar";
export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="flex flex-row justify-between mb-3">
        <h1>Logo</h1>
        <Navbar />
      </div>
      <div className="flex flex-col gap-4">
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
        <TaskColumn title={"Pending"}>
          <TaskTicket id={1} task="Clean kitchen" />
          <TaskTicket id={2} task="Clean rooms" />
        </TaskColumn>

        <TaskColumn title={"In Progress"}>
          <TaskTicket id={3} task="Clean kitchen" />
          <TaskTicket id={4} task="Clean rooms" />
        </TaskColumn>
      </div>
    </div>
  );
}
