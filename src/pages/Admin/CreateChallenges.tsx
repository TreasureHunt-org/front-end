//after we navigate
// drop dowm menu to pick the type of challenge
//a part of the map piece for each challenge
// a dynamic table to add a row with ( test case - expected output)

interface IProps {}

import { useLocation } from "react-router-dom";

const CreateChallenges = () => {
  const location = useLocation();
  const huntId = location.state?.huntId;

  return <div>Creating challenges for hunt #{huntId}</div>;
};
export default CreateChallenges;
