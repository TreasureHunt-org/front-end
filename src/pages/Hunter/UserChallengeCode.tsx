// interface UserChallengeCodeProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const UserChallengeCode: React.FC<UserChallengeCodeProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   if (!isOpen) return null;

//   const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal-content">
//         <p style={{ display: "flex", gap: "20px" }}>
//           <strong style={{ color: "#f39c12" }}>Status:</strong> Accepted ||
//           <strong style={{ color: "#f39c12" }}>Language:</strong> Python
//         </p>
//         <hr className="custom-hr" />
//         <pre>
//           {`
//               def reverse_digits(n):
//                   reversed_number = int(str(n)[::-1])
//                   return reversed_number

//               if _name_ == "_main_":
//                   n = int(input("Enter an integer (1 ≤ N ≤ 10,000): "))
//                   if 1 <= n <= 10000:
//                       print("Reversed Number:", reverse_digits(n))
//                   else:
//                       print("The number is out of range.")
//             `}
//         </pre>
//         <button onClick={onClose} className="close-button">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserChallengeCode;
