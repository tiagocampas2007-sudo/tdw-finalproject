// middlewares/auth.js
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    // Pega token do header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ erro: "Token obrigatório" });
    }
    
    // Verifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
    req.user = decoded;  // { uid, role, office }
    
    next();
  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
  }
};
