import User from "../models/User.js";
import jwt from "jsonwebtoken";

//  getMyProfile (PARA "Ver Perfil")
export const getMyProfile = async (req, res) => {
  try {
    console.log(" getMyProfile chamado!");
    
    // Recupera ID do utilizador do token JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Token em falta" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id).populate("role office").select("-password");
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        office: user.office
      }
    });
  } catch (error) {
    console.log(" Erro getMyProfile:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
