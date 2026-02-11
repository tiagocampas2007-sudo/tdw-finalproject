// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ajusta o caminho se necessário

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ erro: "Token obrigatório" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    // decoded = { uid, role }

    // Buscar o utilizador completo na BD, incluindo a oficina
    const user = await User.findById(decoded.uid).populate("office");

    if (!user) {
      return res.status(401).json({ erro: "Utilizador não encontrado" });
    }

    // Preencher req.user com o que precisas nas rotas protegidas
    req.user = {
      id: user._id,
      role: decoded.role,
      office: user.office?._id ?? null, // ObjectId da oficina (ou null)
    };

    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    res.status(401).json({ erro: "Token inválido" });
  }
};

export default auth;
