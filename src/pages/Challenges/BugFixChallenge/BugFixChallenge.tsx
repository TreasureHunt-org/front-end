import { useState } from "react";
import CodeEditor from "../../../components/CodeEditor/CodeEditor";
import api from "../../../api/axios";
import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";

import "../BugFixChallenge/BugFixChallenge.css";

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

const BugFixChallenge = ({ challenge }: { challenge: Challenge }) => {
  const defaultLanguage = challenge.challengeCodes?.[0]?.language || "JAVA";

  const getBuggyCode = (lang: string): string => {
    const match = challenge.challengeCodes.find((c) => c.language === lang);
    return match ? match.code : "// No buggy code available";
  };

  const [language] = useState(defaultLanguage);
  const [code, setCode] = useState(getBuggyCode(defaultLanguage));
  const buggyCode = challenge.challengeCodes?.[0]?.code || "// Buggy code";
  // const handleLanguageChange = (lang: string) => {
  //   setLanguage(lang);
  //   setCode(getBuggyCode(lang));
  // };

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
      {/* <div className="top-bar">
        <Link to={`/hunt-map-pieces/${challenge.challengeId}`}>
          ← Back to Map
        </Link>
        {/* <Link to="/LastSubmissions">Last Submissions</Link> 
      </div> */}

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
          <div className="flex">
            <h2>🐞 {challenge.title}</h2>

            {/* <div className="language-select-container">
            <label htmlFor="language-select">Language: </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {challenge.challengeCodes.map((item, idx) => (
                <option key={idx} value={item.language}>
                  {item.language}
                </option>
              ))}
            </select> */}

            <div className="fixed-button-container">
              <button
                className="fixed-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit Fixed Code
              </button>
            </div>
          </div>
          {/* </div> */}

          <p style={{ color: "#f39c12", textAlign: "left" }}>
            <strong>Description:</strong>
          </p>
          <p style={{ textAlign: "left" }}>{challenge.description}</p>

          <p style={{ color: "#f39c12", textAlign: "left" }}>
            <strong>Code To Fix:</strong>
          </p>
          <p style={{ textAlign: "left" }}>{buggyCode}</p>

          <hr className="custom-hr" />
          <h3>Test Cases</h3>

          {challenge.testCases?.length > 0 ? (
            <table className="test-cases">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected Output</th>
                </tr>
              </thead>
              <tbody>
                {challenge.testCases.map((test, idx) => (
                  <tr key={idx}>
                    <td>
                      {test.input}
                      <button
                        className="copy-button"
                        onClick={() =>
                          navigator.clipboard.writeText(test.input)
                        }
                      >
                        📋
                      </button>
                    </td>
                    <td>{test.expectedOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No test cases found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BugFixChallenge;

// import React, { useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import CodeEditor from "../../../components/CodeEditor/CodeEditor";
// import api from "../../../api/axios";
// import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";
// import "../BugFixChallenge/BugFixChallenge.css";
// interface Challenge {
//   challengeId: number;
//   huntId: number;
//   title: string;
//   description: string;
//   points: number;
//   challengeType: string;
//   testCases: { input: string; expectedOutput: string }[];
//   challengeCodes: { language: string; code: string }[];
// }

// const BugFixChallenge = ({ challenge }: { challenge: Challenge }) => {
//   const { huntId } = useParams<{ huntId: string }>();
//   const navigate = useNavigate();
//   const defaultLanguage = challenge.challengeCodes?.[0]?.language || "JAVA";
//   const [language] = useState(defaultLanguage);
//   const [code, setCode] = useState(challenge.challengeCodes[0].code);

//   const handleSubmit = async () => {
//     if (!code.trim()) {
//       alert("Please write some code before submitting.");
//       return;
//     }
//     try {
//       const res = await api.post(
//         `${API_BASE_URL}/challenges/${challenge.challengeId}/submissions`,
//         { code, language },
//       );
//       if (res.data.status === "SUCCESS") {
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
//         <Link to={`/hunt-map-pieces/${huntId}`}>← Back to Map</Link>{" "}
//       </div>
//       <div className="main-content">
//         <h2>🐞 {challenge.title}</h2>
//         <CodeEditor
//           language={language}
//           height="400px"
//           readonly={false}
//           value={code}
//           onChange={setCode}
//         />
//         <button className="fixed-button" onClick={handleSubmit}>
//           Submit Fixed Code
//         </button>
//       </div>
//     </>
//   );
// };

// export default BugFixChallenge;

// // import React, { useState } from "react";
// // import CodeEditor from "../../../components/CodeEditor/CodeEditor";
// // import api from "../../../api/axios";
// // import API_BASE_URL from "../../../constants/apiURL/API_BASE_URL";
// // import { Link, useNavigate, useParams } from "react-router-dom";

// // import "../BugFixChallenge/BugFixChallenge.css";

// // interface Challenge {
// //   challengeId: number;
// //   title: string;
// //   description: string;
// //   points: number;
// //   challengeType: string;
// //   externalGameUri: string;
// //   testCases: { input: string; expectedOutput: string }[];
// //   optimalSolutions: any[];
// //   challengeCodes: { language: string; code: string }[];
// //   createdAt: string;
// //   solved?: boolean;
// // }

// // const BugFixChallenge = ({ challenge }: { challenge: Challenge }) => {
// //   const defaultLanguage = challenge.challengeCodes?.[0]?.language || "JAVA";
// //   const { huntId } = useParams<{ huntId: string }>();
// //   const navigate = useNavigate();

// //   const getBuggyCode = (lang: string): string => {
// //     const match = challenge.challengeCodes.find((c) => c.language === lang);
// //     return match ? match.code : "// No buggy code available";
// //   };

// //   const [language, setLanguage] = useState(defaultLanguage);
// //   const [code, setCode] = useState(getBuggyCode(defaultLanguage));
// //   const buggyCode = challenge.challengeCodes?.[0]?.code || "// Buggy code";
// //   // const handleLanguageChange = (lang: string) => {
// //   //   setLanguage(lang);
// //   //   setCode(getBuggyCode(lang));
// //   // };

// //   const handleSubmit = async () => {
// //     if (!code.trim()) {
// //       alert("Please write some code before submitting.");
// //       return;
// //     }

// //     try {
// //       const response = await api.post(
// //         `${API_BASE_URL}/challenges/${challenge.challengeId}/submissions`,
// //         {
// //           code,
// //           language,
// //         },
// //       );
// //       if (response.data?.status === "SUCCESS") {
// //         navigate(`/hunts/${huntId}/map`, {
// //           state: {
// //             solvedChallengeId: challenge.challengeId,
// //             pointsEarned: challenge.points,
// //           },
// //         });
// //       } else {
// //         alert("Submission succeeded but not marked solved.");
// //       }
// //       console.log("Response:", response.data);
// //     } catch (error: any) {
// //       console.error("Submission error:", error);
// //       alert("Submission failed. Please try again.");
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="top-bar">
// //         <Link to="/Challenges">Back to challenges</Link>
// //         <Link to="/LastSubmissions">Last Submissions</Link>
// //       </div>

// //       <div className="main-content">
// //         <div className="code-editor-container">
// //           <CodeEditor
// //             language={language}
// //             height="100%"
// //             readonly={false}
// //             value={code}
// //             onChange={setCode}
// //           />
// //         </div>

// //         <div className="question-panel">
// //           <div className="flex">
// //             <h2>🐞 {challenge.title}</h2>

// //             {/* <div className="language-select-container">
// //             <label htmlFor="language-select">Language: </label>
// //             <select
// //               id="language-select"
// //               value={language}
// //               onChange={(e) => handleLanguageChange(e.target.value)}
// //             >
// //               {challenge.challengeCodes.map((item, idx) => (
// //                 <option key={idx} value={item.language}>
// //                   {item.language}
// //                 </option>
// //               ))}
// //             </select> */}

// //             <div className="fixed-button-container">
// //               <button
// //                 className="fixed-button"
// //                 type="button"
// //                 onClick={handleSubmit}
// //               >
// //                 Submit Fixed Code
// //               </button>
// //             </div>
// //           </div>
// //           {/* </div> */}

// //           <p style={{ color: "#f39c12", textAlign: "left" }}>
// //             <strong>Description:</strong>
// //           </p>
// //           <p style={{ textAlign: "left" }}>{challenge.description}</p>

// //           <p style={{ color: "#f39c12", textAlign: "left" }}>
// //             <strong>Code To Fix:</strong>
// //           </p>
// //           <p style={{ textAlign: "left" }}>{buggyCode}</p>

// //           <hr className="custom-hr" />
// //           <h3>Test Cases</h3>

// //           {challenge.testCases?.length > 0 ? (
// //             <table className="test-cases">
// //               <thead>
// //                 <tr>
// //                   <th>Input</th>
// //                   <th>Expected Output</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {challenge.testCases.map((test, idx) => (
// //                   <tr key={idx}>
// //                     <td>
// //                       {test.input}
// //                       <button
// //                         className="copy-button"
// //                         onClick={() =>
// //                           navigator.clipboard.writeText(test.input)
// //                         }
// //                       >
// //                         📋
// //                       </button>
// //                     </td>
// //                     <td>{test.expectedOutput}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p>No test cases found.</p>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default BugFixChallenge;
