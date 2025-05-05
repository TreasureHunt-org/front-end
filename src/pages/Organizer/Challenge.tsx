import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import API_BASE_URL from "../../constants/API_BASE_URL";
import BugFixChallenge from "../Challenges/BugFixChallenge";
import ProblemSolvingChallenge from "../Challenges/ProblemSolvingChallenge";
import MinigameChallenge from "../Challenges/MinigameChallenge";

interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  points: number;
  challengeType: string;
  externalGameUri: string;
  testCases: any[];
  optimalSolutions: any[];
  challengeCodes: any[];
  createdAt: string;
  solved?: boolean;
}

const Challenge = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get(
          `${API_BASE_URL}/hunts/challenges/${challengeId}`,
        );
        setChallenge(response.data);

        // alert("challenge found");
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="mt-8 text-center text-gray-500">Loading Challenge...</div>
    );
  }
  switch (challenge.challengeType) {
    case "BUGFIX": {
      console.log(challenge.challengeType);
      return <BugFixChallenge challenge={challenge} />;
    }
    case "GAME": {
      console.log(challenge.challengeType);
      return <MinigameChallenge challenge={challenge} />;
    }
    case "CODING": {
      console.log(challenge.challengeType);

      return <ProblemSolvingChallenge challenge={challenge} />;
    }
  }
};
export default Challenge;
