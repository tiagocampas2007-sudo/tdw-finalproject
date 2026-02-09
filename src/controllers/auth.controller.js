import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserRole from "../models/UserRole.js";

export async function register(req, res) {
  try {
    console.log('🔥 REGISTO - DADOS:', req.body);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log('❌ CAMPOS EM FALTA');
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "A palavra-passe deve ter pelo menos 8 caracteres." });
    }

    console.log('🔍 PROCURAR UTILIZADOR:', email);
    const existing = await User.findOne({ email });
    console.log('🔍 UTILIZADOR EXISTE:', existing ? 'SIM' : 'NÃO');
    if (existing) {
      return res.status(409).json({ message: "Já existe uma conta com este email." });
    }

    console.log('🔍 PROCURAR ROLE CLIENT');
    const clientRole = await UserRole.findOne({ role: "CLIENT" });
    console.log('🔍 ROLE CLIENT:', clientRole ? 'ENCONTRADO' : 'NÃO EXISTE');
    if (!clientRole) {
      console.log('❌ CRIAR ROLE CLIENT');
      // CRIAR ROLE SE NÃO EXISTIR
      const newRole = await UserRole.create({ role: "CLIENT" });
      console.log('✅ ROLE CLIENT CRIADO:', newRole._id);
    }

    console.log('🔍 A HASH DA PALAVRA-PASSE...');
    const hashed = await bcrypt.hash(password, 10);
    console.log('✅ HASH OK');

    console.log('🔍 A CRIAR UTILIZADOR...', {email, roleId: clientRole?._id || newRole._id});
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: clientRole?._id || newRole?._id
    });
    
    console.log('✅ UTILIZADOR CRIADO COM SUCESSO:', user._id, user.email);

    return res.status(201).json({
      message: "Conta criada com sucesso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "CLIENT",
        roleId: user.role
      },
    });
  } catch (err) {
    console.error('💥 ERRO REGISTO:', err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function login(req, res) {
  try {
    console.log('🔥 LOGIN - DADOS:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e palavra-passe são obrigatórios." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate("role");
    console.log('🔍 UTILIZADOR ENCONTRADO:', user ? 'SIM' : 'NÃO');
    
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const ok = await bcrypt.compare(password, user.password);
    console.log('🔍 PALAVRA-PASSE CORRETA:', ok);
    
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
      success: true,
      token: token,
      message: "Login efetuado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.role,
      },
    });
  } catch (err) {
    console.error("🔥 ERRO LOGIN:", err);
    return res.status(500).json({ message: "Erro interno no login." });
  }
}

export async function getMe(req, res) {
  try {
    const token = req.cookies?.session || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.json({ 
        user: null, 
        authenticated: false 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
    const user = await User.findById(decoded.uid).populate("role");
    
    if (!user) {
      return res.json({ 
        user: null, 
        authenticated: false 
      });
    }

    return res.json({
      success: true,
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
      success: false,
      user: null, 
      authenticated: false 
    });
  }
}
