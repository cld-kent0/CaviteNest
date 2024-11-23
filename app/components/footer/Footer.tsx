// // components/footer/Footer.tsx

// "use client"; // Mark this component as a Client Component

// import Image from "next/image";
// import { useState, useEffect, CSSProperties } from "react";

// const Footer = () => {
//   // Get the current year for the copyright
//   const [year, setYear] = useState(new Date().getFullYear());

//   // Optional: Update the year dynamically (useful if deployed for long periods)
//   useEffect(() => {
//     const currentYear = new Date().getFullYear();
//     if (year !== currentYear) {
//       setYear(currentYear);
//     }
//   }, [year]);

//   return (
//     <footer style={footerStyle}>
//       <div style={leftSection}>
//         <Image
//           src="/path-to-your-image.jpg"
//           alt="Footer Logo"
//           width={50}
//           height={50}
//         />
//       </div>
//       <div style={centerSection}>
//         <p>© {year} Your Company. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// // Styling
// const footerStyle: CSSProperties = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "10px 20px",
//   backgroundColor: "#333",
//   color: "#fff",
//   position: "relative", // Changed from 'fixed' to 'relative'
//   bottom: "0", // This will not have an effect with 'relative', so it can be removed
//   width: "100%",
//   marginTop: "auto", // Allows the footer to stay at the bottom of the page
// };

// const leftSection: CSSProperties = {
//   flex: 1,
// };

// const centerSection: CSSProperties = {
//   flex: 1,
//   textAlign: "center",
// };

// export default Footer;
