// module.exports = async (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for specific origins if needed
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  
//     if (req.method === 'OPTIONS') {
//       res.status(200).end();
//     } else {
//       next(); // Pass the request to your actual API endpoints
//     }
//   };
  