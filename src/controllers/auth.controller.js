import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserRole from "../models/UserRole.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "A palavra-passe deve ter pelo menos 8 caracteres." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Já existe uma conta com este email." });
    }

    const clientRole = await UserRole.findOne({ role: "CLIENT" });
    if (!clientRole) {
      return res.status(500).json({ message: 'Role "CLIENT" não existe em user_roles.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: clientRole._id
    });

    return res.status(201).json({
      message: "Conta criada com sucesso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: clientRole.role,
        roleId: clientRole.id
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e password são obrigatórios." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate("role");
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { uid: user._id, role: user.role.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login efetuado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.role,
      },
    });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    return res.status(500).json({ message: "Erro interno no login." });
  }
}

export async function getMe(req, res) {
  try {
    const token = req.cookies?.session;
    
    if (!token) {
      return res.json({ 
        user: null, 
        authenticated: false 
      });
    }

    // Vérify token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
    
    // find user
    const user = await User.findById(decoded.uid).populate("role");
    
    if (!user) {
      return res.json({ 
        user: null, 
        authenticated: false 
      });
    }

    return res.json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.role,
      }
    });
  } catch (err) {
    console.error("getMe ERROR:", err.message);
    return res.json({ 
      user: null, 
      authenticated: false 
    });
  }
}
