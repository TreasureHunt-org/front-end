import { ThreeCircles } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="flex h-screen w-full flex-1 items-center justify-center">
      <div className="mx-auto">
        <ThreeCircles
          visible={true}
          height="50"
          width="50"
          color="#f39c12"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </div>
  );
};

export default Spinner;
