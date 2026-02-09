import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// 🔍 Obter o meu perfil
export const getMyProfile = async (req, res) => {
  try {
    console.log("🔍 getMyProfile chamado!");
    
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) token = req.cookies?.session;

    console.log('🔥 TOKEN RECEBIDO:', token?.slice(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log('✅ TOKEN DECODIFICADO:', decoded);

    const user = await User.findById(decoded.id || decoded.uid)
      .populate("role office")
      .select("-password");
    
    console.log('🔍 UTILIZADOR ENCONTRADO:', user ? user.name : 'NULL');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Utilizador não encontrado"
      });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name || user.role?.role || user.role,
        office: user.office,
        mechanic: user.mechanic
      }
    });
  } catch (error) {
    console.error("❌ Erro getMyProfile:", error.message);
    res.status(401).json({ success: false, error: "Token inválido" });
  }
};

// 🔐 Login - TOTALMENTE CORRIGIDO!
export const login = async (req, res) => {
  try {
    console.log("🔐 Login:", req.body.email);
    
    const { email, password } = req.body;
    
    // ✅ CORREÇÃO FINAL: .select('+password') + DEBUG
    const user = await User.findOne({ email })
      .select('+password')  // ← PROBLEMA RESOLVIDO!
      .populate("role");
    
    console.log("👤 User encontrado:", user ? user.name : "NULL");
    
    if (!user) {
      console.log("❌ User não existe");
      return res.status(400).json({ 
        success: false, 
        error: "Email ou palavra-passe incorretos" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 PASSWORD MATCH:", isMatch);  // ← VERIFICA AQUI!
    
    if (!isMatch) {
      console.log("❌ Password errada");
      return res.status(400).json({ 
        success: false, 
        error: "Email ou palavra-passe incorretos" 
      });
    }

    // ✅ TOKEN com uid (consistente)
    const token = jwt.sign(
      { 
        uid: user._id,  // ← uid para compatibilidade
        role: user.role?.name || user.role 
      }, 
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("✅ LOGIN OK:", user.name);
    
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role?.name || user.role 
      }
    });
    
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ success: false, error: "Erro servidor" });
  }
};

// Resto das funções SEM MUDANÇAS (updateMyProfile, applyMechanic, logout)
export const updateMyProfile = async (req, res) => {
  try {
    console.log("[DEBUG] updateMyProfile chamado:", req.body);

    let token = req.headers.authorization?.split(" ")[1];
    if (!token) token = req.cookies?.session;
    
    if (!token) {
      return res.status(401).json({ success: false, error: "Token em falta" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log("[DEBUG] Token decodificado:", decoded);

    const userId = decoded.id || decoded.uid;
    console.log("[DEBUG] User ID usado:", userId);

    const { name, email } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: "O nome deve ter pelo menos 2 caracteres" 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        name: name.trim(),
        ...(email && email.trim() && { email: email.trim() })
      },
      { 
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "Utilizador não encontrado" 
      });
    }

    console.log("[DEBUG] Perfil atualizado:", user.name);
    
    res.json({ 
      success: true, 
      message: "Perfil atualizado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("[ERRO] updateMyProfile:", error.message);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: "Token inválido" });
    }
    
    res.status(500).json({ success: false, error: "Erro ao atualizar perfil" });
  }
};

export const applyMechanic = async (req, res) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) token = req.cookies?.session;
    
    if (!token) {
      return res.status(401).json({ success: false, error: "Token em falta" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const { specialties } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id || decoded.uid,  // ← Corrige uid/id
      { 
        mechanic: true,
        mechanicSpecialties: specialties 
      },
      { new: true }
    ).select("-password");

    res.json({ 
      success: true, 
      message: "Candidatura submetida com sucesso!",
      user
    });
  } catch (error) {
    console.error("❌ Erro applyMechanic:", error);
    res.status(500).json({ success: false, error: "Erro na candidatura" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("session");
  res.json({ success: true, message: "Logout realizado com sucesso" });
};
