// // src/layouts/garrisonverifier/GarrisonTable.js
// import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper ,Typography} from '@mui/material';
// import ArgonBox from 'components/ArgonBox';
// const GarrisonTable = ({ data }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table >
//         <TableHead>
//           <TableRow>
//             <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary" fontWeight="bold">
//                   Sr
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//             <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary" fontWeight="bold" >
//                   NAME
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//            <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary"   fontWeight="bold">
//                   GENDER
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//              <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary"   fontWeight="bold">
//                   OCCUPATION
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//              <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary" fontWeight="bold">
//                   CATEGORY
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//            <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary"   fontWeight="bold">
//                   TYPE
//                 </Typography>
//               </ArgonBox>
//           </TableCell>
//            <TableCell>
//               <ArgonBox display="flex" justifyContent="center">
//                 <Typography variant="h6" color="primary" fontWeight="bold">
//                   CNIC
//                 </Typography>
//               </ArgonBox>
//             </TableCell>
//             </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.map((row, index) => (
//             <TableRow key={index}>
//               <TableCell>{row.SR}</TableCell>
//               <TableCell>{row.NAME}</TableCell>
//               <TableCell>{row.GENDER}</TableCell>
//               <TableCell>{row.OCCUPTION}</TableCell>
//               <TableCell>{row.CATEGORY}</TableCell>
//               <TableCell>{row.TYPE}</TableCell>
//               <TableCell>{row.CNIC}</TableCell>
//               </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };
// export default GarrisonTable;
"use strict";
//# sourceMappingURL=GarrisonTable.dev.js.map
