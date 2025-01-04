export default function SearchAndFilter() {
  return (
    <div className="grid grid-cols-1 gap-2 bg-transparent rounded-md p-4 outline outline-2 outline-gray-200 md:grid-cols-3">
      <input
        className="rounded-md border-2 bg-transparent px-3 py-2 focus-visible:outline-black md:col-span-2"
        type="text"
        placeholder="Search tasks..."
      />
      <select className="bg-transparent border-2 rounded-md px-3 py-2 focus:outline-black">
        <option>Filter by...</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
  );
}
