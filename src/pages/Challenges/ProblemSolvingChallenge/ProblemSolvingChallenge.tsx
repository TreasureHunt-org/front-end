import { useState } from "react";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import api from "../../../api/axios";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";

interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  points: number;
  challengeType: string;
  externalGameUri: string;
  testCases: { input: string; expectedOutput: string }[];
  optimalSolutions: any[];
  challengeCodes: { language: string; code: string }[];
  createdAt: string;
  solved?: boolean;
}

const ProblemSolvingChallenge = ({ challenge }: { challenge: Challenge }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JAVA");

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please write some code before submitting.");
      return;
    }

    try {
      const response = await api.post(
        `${API_BASE_URL}/challenges/${challenge.challengeId}/submissions`,
        {
          code,
          language,
        },
      );
      if (response.data?.status === "SUCCESS") {
        window.dispatchEvent(
          new CustomEvent("challengeSolved", {
            detail: {
              challengeId: challenge.challengeId,
              challengeType: challenge.challengeType,
              points: challenge.points,
            },
          }),
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <>
      <div className="top-bar">
        {/* <Link to={`/hunt-map-pieces/${challenge.challengeId}`}>
          ← Back to Map
        </Link> */}
        {/* <Link to="/LastSubmissions">Last Submissions</Link> */}
      </div>

      <div className="main-content">
        <div className="code-editor-container">
          <CodeEditor
            language={language}
            height="100%"
            readonly={false}
            code={code}
            onChange={setCode}
          />
        </div>

        <div className="question-panel">
          <h1>{challenge?.title || "Problem Solving Challenge"}</h1>
          <div className="language-select-container">
            <label htmlFor="language-select">Language: </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="JAVA">Java</option>
              <option value="PYTHON">Python</option>
              <option value="C_PLUS_PLUS">C++</option>
              <option value="C">C</option>
            </select>
            <div className="submit-button-container">
              <button
                className="submit-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>
          </div>
          <h3>{challenge?.description}</h3>

          <hr className="custom-hr" />
          <h3>Test cases:</h3>

          <table className="test-cases">
            <thead>
              <tr>
                <th>Input</th>
                <th>Expected Output</th>
              </tr>
            </thead>
            <tbody>
              {challenge?.testCases?.map((test, index) => (
                <tr key={index}>
                  <td>
                    {test.input}
                    <button
                      className="copy-button"
                      onClick={() => navigator.clipboard.writeText(test.input)}
                    >
                      📋
                    </button>
                  </td>
                  <td>{test.expectedOutput}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProblemSolvingChallenge;

// import React, { useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import CodeEditor from "../../../components/CodeEditor/CodeEditor";
// import api from "../../../api/axios";
// import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";

// interface Challenge {
//   challengeId: number;
//   huntId: number;
//   title: string;
//   description: string;
//   points: number;
//   testCases: { input: string; expectedOutput: string }[];
// }

// const ProblemSolvingChallenge = ({ challenge }: { challenge: Challenge }) => {
//   const { huntId } = useParams<{ huntId: string }>();
//   const navigate = useNavigate();
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("JAVA");

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       alert("Please write some code before submitting.");
//       return;
//     }
//     try {
//       const response = await api.post(
//         `${API_BASE_URL}/challenges/${challenge.challengeId}/submissions`,
//         { code, language },
//       );
//       if (response.data.status === "SUCCESS") {
//         navigate(`/hunt-map-pieces/${huntId}`, {
//           state: {
//             solvedChallengeId: challenge.challengeId,
//             pointsEarned: challenge.points,
//           },
//         });
//       } else {
//         alert("Submission succeeded but was not marked solved.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Submission failed. Try again.");
//     }
//   };

//   return (
//     <>
//       <div className="top-bar">
//         <Link to={`/hunt-map-pieces/${challenge.challengeId}`}>
//           ← Back to Map
//         </Link>
//       </div>

//       <div className="main-content">
//         <div className="code-editor-container">
//           <CodeEditor
//             language={language}
//             height="100%"
//             readonly={false}
//             value={code}
//             onChange={setCode}
//           />
//         </div>

//         <div className="question-panel">
//           <h1>{challenge?.title || "Problem Solving Challenge"}</h1>

//           <div className="language-select-container">
//             <label htmlFor="language-select">Language: </label>
//             <select
//               id="language-select"
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//             >
//               <option value="JAVA">Java</option>
//               <option value="PYTHON">Python</option>
//               <option value="C_PLUS_PLUS">C++</option>
//               <option value="C">C</option>
//             </select>

//             <div className="submit-button-container">
//               <button
//                 className="submit-button"
//                 type="button"
//                 onClick={handleSubmit}
//               >
//                 Submit Code
//               </button>
//             </div>
//           </div>

//           <h3>{challenge?.description}</h3>
//           <hr className="custom-hr" />

//           <h3>Test cases:</h3>
//           <table className="test-cases">
//             <thead>
//               <tr>
//                 <th>Input</th>
//                 <th>Expected Output</th>
//               </tr>
//             </thead>
//             <tbody>
//               {challenge?.testCases?.map((test, index) => (
//                 <tr key={index}>
//                   <td>
//                     {test.input}
//                     <button
//                       className="copy-button"
//                       onClick={() => navigator.clipboard.writeText(test.input)}
//                     >
//                       📋
//                     </button>
//                   </td>
//                   <td>{test.expectedOutput}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProblemSolvingChallenge;
