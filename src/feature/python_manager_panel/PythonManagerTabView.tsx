import PythonEnvSelector from "./components/PythonEnvSelector";
import PythonPackageList from "./components/PythonPackageList";

const PythonManagerTabView = () => {
  return (
    <div className="container">
      <div className="py-4" />
      <PythonEnvSelector />
      <PythonPackageList />
    </div>
  );
};

export default PythonManagerTabView;
