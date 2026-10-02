import Panel from "../components/Panel";

export default function ShopMADPage() {
  return (
    <div className="p-6 space-y-6">

      <Panel title="ShopMAD Product Manager">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-3 rounded-lg bg-black border border-[#00e6e6] text-[#00ffff] focus:outline-none focus:border-[#00ffff]"
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 rounded-lg bg-black border border-[#00e6e6] text-[#00ffff] focus:outline-none focus:border-[#00ffff]"
          />

          <textarea
            placeholder="Product Description"
            className="w-full p-3 rounded-lg bg-black border border-[#00e6e6] text-[#00ffff] focus:outline-none focus:border-[#00ffff]"
          />

          <button className="px-6 py-3 rounded-xl bg-[#00e6e6] text-black font-bold shadow-[0_0_20px_#00e6e6] hover:shadow-[0_0_35px_#00ffff] transition-all">
            Add Product
          </button>
        </div>
      </Panel>

      <Panel title="Current Inventory">
        <p className="text-[#00ffff] opacity-80">
          Inventory syncing will be connected once backend is activated.
        </p>
      </Panel>

    </div>
  );
}
