
const SidebarUsageInfo: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-sm font-semibold text-gray-700">Uso de la organización</div>
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>Créditos:</span>
        <span>$0.00 restantes</span>
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-600">
        <span>Agentes:</span>
        <span>1 / 1 disponibles</span>
      </div>
      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-red-500 h-1.5 rounded-full w-full"></div>
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-600">
        <span className="flex items-center">
          <span className="inline-block mr-1 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-xs">
            i
          </span>
          Campañas:
        </span>
        <span>0 / 1 disponibles</span>
      </div>
    </div>
  );
};

export default SidebarUsageInfo;
